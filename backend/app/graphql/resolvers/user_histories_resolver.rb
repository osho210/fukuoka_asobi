# frozen_string_literal: true

module Resolvers
  class UserHistoriesResolver < Resolvers::BaseResolver
    type [Types::UserHistoryType], null: true
    description "ログインユーザーの閲覧履歴一覧を取得"

    # オプショナルな引数
    argument :viewable_type, String, required: false, description: "閲覧対象の型でフィルタリング"
    argument :limit, Integer, required: false, description: "取得件数の制限"

    def resolve(viewable_type: nil, limit: nil)
      # 現在のユーザーを取得
      current_user = context[:current_user]

      # ユーザーが認証されていない場合は空配列を返す
      return [] unless current_user

      # ユーザーの閲覧履歴を取得（N+1クエリを防ぐためにviewableをプリロード）
      histories = current_user.user_histories.includes(:viewable).latest

      # タイプでフィルタリング
      histories = histories.by_type(viewable_type) if viewable_type.present?

      # 件数制限
      histories = histories.limit(limit) if limit.present?

      histories
    end
  end
end
