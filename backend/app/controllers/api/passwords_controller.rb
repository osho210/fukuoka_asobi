module Api
  class PasswordsController < ApplicationController
    # CSRF保護をスキップ（APIモードのため）
    skip_before_action :verify_authenticity_token

    # パスワードリセットリクエスト（廃止済み）
    def forgot
      render json: {
        success: false,
        message: 'パスワード認証は廃止されました。Googleアカウントでログインしてください。'
      }, status: :gone
    end

    # パスワードリセット実行（廃止済み）
    def reset
      render json: {
        success: false,
        message: 'パスワード認証は廃止されました。Googleアカウントでログインしてください。'
      }, status: :gone
    end
  end
end
