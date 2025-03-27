# frozen_string_literal: true

require_relative '../../services/plan_generator'

module Mutations
  class GeneratePlan < BaseMutation
    description "検索条件に基づいてプランを自動生成"

    # InputObjectを使用
    argument :input, Types::GeneratePlanInputType, required: true

    field :plan, Types::GeneratedPlanType, null: true
    field :errors, [String], null: false

    def resolve(input:)
      # プラン生成サービスを呼び出す
      plan_generator = Services::PlanGenerator.new(
        areas: input[:areas],
        date: input[:date],
        member_info: input[:member_info],
        budget: input[:budget],
        start_time: input[:start_time],
        end_time: input[:end_time],
        custom_options: input[:custom_options]
      )

      begin
        generated_plan = plan_generator.generate
        { plan: generated_plan, errors: [] }
      rescue => e
        { plan: nil, errors: [e.message] }
      end
    end
  end
end
