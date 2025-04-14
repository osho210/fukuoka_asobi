# frozen_string_literal: true

require_relative '../../services/plan_generator'

module Mutations
  class GeneratePlan < GraphQL::Schema::Mutation
    description "検索条件に基づいてプランを自動生成（要ログイン）"

    # 直接引数を定義
    argument :districts, [ID], required: true
    argument :date, String, required: true
    argument :member_info, Types::MemberInfoInputType, required: true
    argument :budget, Types::BudgetInputType, required: true
    argument :start_time, String, required: false
    argument :end_time, String, required: false
    argument :custom_options, Types::CustomOptionsInputType, required: false

    field :plan, Types::GeneratedPlanType, null: true
    field :errors, [String], null: false

  def resolve(districts:, date:, member_info:, budget:, start_time: nil, end_time: nil, custom_options: nil)
    # 認証チェック
    # ログインしていない場合はエラーを返す
    unless context[:current_user]
      return { plan: nil, errors: ["ログインが必要です"] }
    end

    # プラン生成サービスを呼び出す
    plan_generator = Services::PlanGenerator.new(
      districts: districts,
      date: date,
      member_info: member_info,
      budget: budget,
      start_time: start_time,
      end_time: end_time,
      custom_options: custom_options,
      user: context[:current_user]
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
