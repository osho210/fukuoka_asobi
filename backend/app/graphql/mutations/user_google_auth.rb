# frozen_string_literal: true

module Mutations
  class UserGoogleAuth < BaseMutation
    description "Googleアカウントでの認証を行います"

    # 入力フィールド
    argument :id_token, String, required: true
    argument :terms_agreed, Boolean, required: false

    # 出力フィールド
    field :user, Types::UserType, null: true
    field :token, String, null: true
    field :is_new_user, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id_token:, terms_agreed: nil)
      begin
        # Google IDトークンを検証
        validator = GoogleIDToken::Validator.new
        payload = validator.check(id_token, Rails.application.credentials.google[:client_id])

        # Googleから取得した情報
        email = payload['email']
        name = payload['name'] || email.split('@').first

        # ユーザーを検索
        user = User.find_by(email: email)

        if user
          # 既存ユーザーの場合はログイン処理
          token = generate_token(user)

          {
            user: user,
            token: token,
            is_new_user: false,
            errors: []
          }
        else
          # 新規ユーザーの場合
          unless terms_agreed
            return {
              user: nil,
              token: nil,
              is_new_user: true,
              errors: ["新規ユーザーの場合は利用規約への同意が必要です"]
            }
          end

          # ユーザー作成（パスワードなしでGoogle OAuth専用）
          user = User.new(
            email: email,
            username: name,
            gender: 'prefer_not_to_say',
            terms_agreed: terms_agreed
          )

          if user.save
            token = generate_token(user)

            {
              user: user,
              token: token,
              is_new_user: true,
              errors: []
            }
          else
            {
              user: nil,
              token: nil,
              is_new_user: true,
              errors: user.errors.full_messages
            }
          end
        end
      rescue => e
        {
          user: nil,
          token: nil,
          is_new_user: false,
          errors: ["認証に失敗しました: #{e.message}"]
        }
      end
    end

    private

    def generate_token(user)
      payload = {
        sub: user.id,
        jti: user.jti,
        scp: 'user',
        exp: 1.day.from_now.to_i
      }

      JWT.encode(payload, Rails.application.credentials.dig(:devise, :jwt_secret_key))

    end
  end
end
