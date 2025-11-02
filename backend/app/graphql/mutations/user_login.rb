# frozen_string_literal: true

module Mutations
  class UserLogin < BaseMutation
    description "ユーザーログインを行います"

    # 入力フィールド
    argument :email, String, required: true
    argument :password, String, required: true

    # 出力フィールド
    field :user, Types::UserType, null: true
    field :token, String, null: true
    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(email:, password:)
      # ユーザーを検索
      user = User.find_for_authentication(email: email)

      # ユーザーが存在し、パスワードが正しい場合
      if user&.valid_password?(password)
        # Cookieを設定
        context[:controller].send(:set_user_cookie, user)

        # JWTトークンを生成（互換性のために残す）
        token = generate_token(user)

        {
          user: user,
          token: token,
          success: true,
          errors: []
        }
      else
        {
          user: nil,
          token: nil,
          errors: ["メールアドレスまたはパスワードが正しくありません"]
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
