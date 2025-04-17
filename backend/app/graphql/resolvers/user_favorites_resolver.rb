# frozen_string_literal: true

module Resolvers
  class UserFavoritesResolver < Resolvers::BaseResolver
    type [Types::FavoriteType], null: true
    description "ログインユーザーのお気に入りプラン一覧を取得"

    def resolve
      # 現在のユーザーを取得
      current_user = context[:current_user]

      # ユーザーが認証されていない場合は空配列を返す
      return [] unless current_user

      # ユーザーのお気に入りを取得
      current_user.favorites.latest
    end
  end
end
