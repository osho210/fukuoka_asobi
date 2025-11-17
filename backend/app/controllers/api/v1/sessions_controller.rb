# frozen_string_literal: true

module Api
  module V1
    class SessionsController < ApplicationController
      include Authentication

      # CSRF保護を無効化（APIエンドポイントのため）
      skip_before_action :verify_authenticity_token

      # ログイン処理（廃止済み）
      def create
        render json: {
          success: false,
          errors: ["パスワード認証は廃止されました。Googleアカウントでログインしてください。"]
        }, status: :gone
      end

      # ログアウト処理
      def destroy
        # Cookieを削除
        clear_user_cookie

        render json: { success: true }
      end
    end
  end
end
