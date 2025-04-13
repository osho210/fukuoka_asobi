# frozen_string_literal: true

module Resolvers
  class UserBookmarksResolver < Resolvers::BaseResolver
    type [Types::BookmarkType], null: false
    description "ログインユーザーのブックマーク一覧を取得します"

    argument :limit, Integer, required: false, default_value: 10
    argument :bookmarkable_type, String, required: false, description: "ブックマークタイプでフィルタリング（例: PlayPlan）"
    argument :category, String, required: false, description: "カテゴリでフィルタリング"

    def resolve(limit: 10, bookmarkable_type: nil, category: nil)
      # 現在のユーザーを取得
      current_user = context[:current_user]

      # ユーザーが認証されていない場合は空の配列を返す
      return [] unless current_user

      # ユーザーのブックマークを取得
      query = current_user.bookmarks

      # ブックマークタイプでフィルタリング
      query = query.by_type(bookmarkable_type) if bookmarkable_type.present?

      # カテゴリでフィルタリング
      query = query.where(category: category) if category.present?

      # 最新のブックマークを取得
      query.latest.limit(limit)
    end
  end
end
