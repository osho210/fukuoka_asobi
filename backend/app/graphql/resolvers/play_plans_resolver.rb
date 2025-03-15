module Resolvers
  class PlayPlansResolver < Resolvers::BaseResolver
    type [Types::PlayPlanType], null: false

    argument :limit, Integer, required: false, default_value: 5
    argument :status, Types::PlayPlanStatusEnum, required: false

    def resolve(limit: 5, status: nil)
      query = PlayPlan.all

      # ステータスが指定されている場合はフィルタリング
      query = query.where(status: status) if status.present?

      # 最新のプランを取得
      query.latest.limit(limit)
    end
  end
end
