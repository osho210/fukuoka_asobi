# frozen_string_literal: true

module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :verify_authenticity_token

      # ログイン（廃止済み）
      def login
        render json: {
          error: 'パスワード認証は廃止されました。Googleアカウントでログインしてください。'
        }, status: :gone
      end

      # 会員登録（廃止済み）
      def signup
        render json: {
          errors: ['パスワードによる新規登録は廃止されました。Googleアカウントでログインしてください。']
        }, status: :gone
      end

      # ログアウト
      def logout
        sign_out(current_user) if current_user
        render json: { message: 'ログアウトしました' }, status: :ok
      end
    end
  end
end
