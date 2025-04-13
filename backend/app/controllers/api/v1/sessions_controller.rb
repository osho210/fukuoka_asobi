# frozen_string_literal: true

module Api
  module V1
    class SessionsController < ApplicationController
      include Authentication

      # CSRF保護を無効化（APIエンドポイントのため）
      skip_before_action :verify_authenticity_token

      # ログイン処理
      def create
        user = User.find_for_authentication(email: params[:email])

        if user&.valid_password?(params[:password])
          # Cookieを設定
          set_user_cookie(user)

          # JWTトークンを生成（互換性のために残す）
          token = generate_token(user)

          render json: {
            success: true,
            user: {
              id: user.id,
              email: user.email,
              username: user.username
            },
            token: token
          }
        else
          render json: {
            success: false,
            errors: ["メールアドレスまたはパスワードが正しくありません"]
          }, status: :unauthorized
        end
      end

      # ログアウト処理
      def destroy
        # Cookieを削除
        clear_user_cookie

        render json: { success: true }
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
end
