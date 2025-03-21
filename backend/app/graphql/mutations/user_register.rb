# frozen_string_literal: true

module Mutations
  class UserRegister < BaseMutation
    description "ユーザー登録を行います"

    # 入力フィールド
    argument :email, String, required: true
    argument :password, String, required: true
    argument :nickname, String, required: true
    argument :gender, String, required: true
    argument :terms_agreed, Boolean, required: true

    # 出力フィールド
    field :user, Types::UserType, null: true
    field :token, String, null: true
    field :errors, [String], null: false

    def resolve(email:, password:, nickname:, gender:, terms_agreed:)
      # 利用規約に同意していない場合はエラー
      unless terms_agreed
        return {
          user: nil,
          token: nil,
          errors: ["利用規約に同意してください"]
        }
      end

      # ユーザー作成
      user = User.new(
        email: email,
        password: password,
        username: nickname,
        gender: gender,
        terms_agreed: terms_agreed
      )

      if user.save
        # JWTトークンを生成
        token = generate_token(user)

        {
          user: user,
          token: token,
          errors: []
        }
      else
        {
          user: nil,
          token: nil,
          errors: user.errors.full_messages
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

      JWT.encode(payload, Rails.application.credentials.secret_key_base)
    end
  end
end
