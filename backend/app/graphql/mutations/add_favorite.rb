# frozen_string_literal: true

module Mutations
  class AddFavorite < BaseMutation
    description "プランをお気に入りに追加します"

    # 入力フィールド
    argument :play_plan_id, ID, required: true

    # 出力フィールド
    field :favorite, Types::FavoriteType, null: true
    field :errors, [String], null: false

    def resolve(play_plan_id:)
      # 現在のユーザーを取得
      current_user = context[:current_user]

      # ユーザーが認証されていない場合はエラー
      unless current_user
        return {
          favorite: nil,
          errors: ["認証されていません。ログインしてください。"]
        }
      end

      # サービスクラスを使用してお気に入りを追加
      result = Favorites::ToggleService.new(
        user: current_user,
        play_plan_id: play_plan_id,
        action: 'add'
      ).call

      {
        favorite: result[:favorite],
        errors: result[:errors] || []
      }
    end
  end
end
