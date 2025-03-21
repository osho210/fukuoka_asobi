# frozen_string_literal: true

module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :verify_authenticity_token

      # ログイン
      def login
        user = User.find_for_authentication(email: params[:email])

        if user&.valid_password?(params[:password])
          render json: {
            user: {
              id: user.id,
              email: user.email,
              username: user.username
            },
            token: request.env['warden-jwt_auth.token']
          }, status: :ok
        else
          render json: { error: 'メールアドレスまたはパスワードが正しくありません' }, status: :unauthorized
        end
      end

      # 会員登録
      def signup
        user = User.new(user_params)
        # デフォルトロールを設定
        user.role = :user

        # terms_agreedをバリデーション用に変換
        user.terms_agreed = user.terms_agreed.to_s == 'true' ? '1' : '0'

        if user.save
          sign_in(user)
          render json: {
            user: {
              id: user.id,
              email: user.email,
              username: user.username
            },
            token: request.env['warden-jwt_auth.token']
          }, status: :created
        else
          Rails.logger.error("User save error: #{user.errors.full_messages}")
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # ログアウト
      def logout
        sign_out(current_user)
        render json: { message: 'ログアウトしました' }, status: :ok
      end

      private

      def user_params
        params.require(:user).permit(:email, :password, :username, :gender, :terms_agreed)
      end
    end
  end
end
