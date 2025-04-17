# frozen_string_literal: true

module Resolvers
  class IsFavoriteResolver < Resolvers::BaseResolver
    type Boolean, null: false
    description "指定したプランがお気に入りに登録されているかを確認"

    argument :play_plan_id, ID, required: true

    def resolve(play_plan_id:)
      # 現在のユーザーを取得
      current_user = context[:current_user]

      # ユーザーが認証されていない場合はfalseを返す
      return false unless current_user

      # プランがお気に入りに登録されているかを確認
      current_user.favorites.exists?(play_plan_id: play_plan_id)
    end
  end
end
