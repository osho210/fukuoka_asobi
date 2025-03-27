module Resolvers
  class GeneratePlanResolver < Resolvers::BaseResolver
    type Types::GeneratedPlanType, null: false
    description "検索条件に基づいてプランを自動生成"

    def resolve(input:)
      # プラン生成サービスを呼び出す
      plan_generator = Services::PlanGenerator.new(
        areas: input.areas,
        date: input.date,
        member_info: input.member_info,
        budget: input.budget,
        start_time: input.start_time,
        end_time: input.end_time,
        custom_options: input.custom_options
      )

      plan_generator.generate
    end
  end
end
