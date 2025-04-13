# frozen_string_literal: true

module Api
  module V1
    class UsersController < ApplicationController
      include Authentication

      # CSRF保護を無効化（APIエンドポイントのため）
      skip_before_action :verify_authenticity_token

      # 現在のユーザー情報を取得
      def login_user
        user = current_user_from_cookie

        if user
          render json: {
            success: true,
            user: {
              id: user.id,
              email: user.email,
              username: user.username,
              profileImageUrl: user.profile_image_url
            }
          }
        else
          render json: {
            success: false,
            errors: ["認証されていません"]
          }, status: :unauthorized
        end
      end
    end
  end
end
