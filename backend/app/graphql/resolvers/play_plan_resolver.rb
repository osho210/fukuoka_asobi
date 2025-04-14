module Resolvers
  class PlayPlanResolver < Resolvers::BaseResolver
    type Types::PlayPlanType, null: true

    argument :id, Integer, required: true

    def resolve(id:)
      user = context[:current_user]
      raise GraphQL::ExecutionError, "ログインが必要です" unless user

      plan = PlayPlan.find_by(id: id)
      raise GraphQL::ExecutionError, "該当プランが見つかりません" unless plan

      # 有償ユーザーまたはプラン作成者本人のみアクセス可能
      unless user.paid_member? || user.id == plan.user_id
        raise GraphQL::ExecutionError, "こちらのページは課金しないと見れません"
      end

      plan
    rescue StandardError => e
      Rails.logger.error("PlayPlanResolver error: #{e.message}")
      raise GraphQL::ExecutionError, e.message
    end
  end
end
