# frozen_string_literal: true

module Mutations
  class RemoveFavorite < BaseMutation
    description "プランをお気に入りから削除します"

    # 入力フィールド
    argument :play_plan_id, ID, required: true

    # 出力フィールド
    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(play_plan_id:)
      # 現在のユーザーを取得
      current_user = context[:current_user]

      # ユーザーが認証されていない場合はエラー
      unless current_user
        return {
          success: false,
          errors: ["認証されていません。ログインしてください。"]
        }
      end

      # サービスクラスを使用してお気に入りを削除
      result = Favorites::ToggleService.new(
        user: current_user,
        play_plan_id: play_plan_id,
        action: 'remove'
      ).call

      {
        success: result[:success] || false,
        errors: result[:errors] || []
      }
    end
  end
end
