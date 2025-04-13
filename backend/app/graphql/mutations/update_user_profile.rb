# frozen_string_literal: true

module Mutations
  class UpdateUserProfile < BaseMutation
    description "ユーザープロフィールを更新します"

    # 入力フィールド
    argument :username, String, required: false
    argument :instagram_url, String, required: false
    argument :bio, String, required: false
    argument :profile_image_url, String, required: false

    # 出力フィールド
    field :user, Types::UserType, null: true
    field :errors, [String], null: false

    def resolve(username: nil, instagram_url: nil, bio: nil, profile_image_url: nil)
      # 現在のユーザーを取得
      current_user = context[:current_user]

      # ユーザーが認証されていない場合はエラー
      unless current_user
        return {
          user: nil,
          errors: ["認証されていません。ログインしてください。"]
        }
      end

      # 更新するフィールドを設定
      update_params = {}
      update_params[:username] = username if username.present?
      update_params[:instagram_url] = instagram_url if instagram_url.present?
      update_params[:bio] = bio if bio.present?
      update_params[:profile_image_url] = profile_image_url if profile_image_url.present?

      # ユーザー情報を更新
      if current_user.update(update_params)
        {
          user: current_user,
          errors: []
        }
      else
        {
          user: nil,
          errors: current_user.errors.full_messages
        }
      end
    end
  end
end
