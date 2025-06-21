# frozen_string_literal: true

module Resolvers
  class UserPlayPlansResolver < Resolvers::BaseResolver
    type [Types::PlayPlanType], null: false
    description "ログインユーザーが作成したプラン一覧を取得します"

    argument :limit, Integer, required: false, default_value: 10
    argument :status, Types::StatusEnumType, required: false

    def resolve(limit: 10, status: nil)
      # 現在のユーザーを取得
      current_user = context[:current_user]

      # ユーザーが認証されていない場合は空の配列を返す
      return [] unless current_user

      # ユーザーが作成したプランを取得
      query = PlayPlan.by_user(current_user.id)

      # ステータスが指定されている場合はフィルタリング
      query = query.where(status: status) if status.present?

      # 最新のプランを取得
      query.latest.limit(limit)
    end
  end
end
