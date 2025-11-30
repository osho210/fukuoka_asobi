module Resolvers
  class PlayPlansResolver < Resolvers::BaseResolver
    type [Types::PlayPlanType], null: false

    argument :limit, Integer, required: false, default_value: 5
    argument :status, Types::StatusEnumType, required: false
    argument :is_recommended, Boolean, required: false, description: "編集部おすすめのプランのみを取得"

    # 公開中の編集部おすすめプランのみを表示する
    def resolve(limit: 5, status: nil, is_recommended: nil)
      query = PlayPlan.all

      query = query.recommended if is_recommended

      # 最新のプランを取得
      query.latest.limit(limit)
    end
  end
end
