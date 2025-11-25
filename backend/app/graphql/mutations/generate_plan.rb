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
      plan_generator = PlanGenerator.new(
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
      rescue InvalidSearchParametersError => e
        # バリデーションエラーの場合
        handle_validation_error(e)
      rescue InsufficientSpotsError => e
        # スポット不足エラーの場合
        { plan: nil, errors: [e.message] }
      rescue PlanGenerationError => e
        # プラン生成エラーの場合（プレミアム機能エラーを含む）
        { plan: nil, errors: [e.message] }
      rescue StandardError => e
        # 予期しないエラーの場合
        Rails.logger.error("プラン生成中に予期しないエラーが発生しました: #{e.message}")
        Rails.logger.error(e.backtrace.join("\n"))
        { plan: nil, errors: [I18n.t('errors.plan_generation.internal_error')] }
      end
    end

    private

    # バリデーションエラーを処理
    # @param error [InvalidSearchParametersError] バリデーションエラー
    # @return [Hash] エラーレスポンス
    def handle_validation_error(error)
      # detailsから具体的なエラーメッセージを抽出
      if error.details.any?
        error_messages = error.details.flat_map do |field, messages|
          messages.map { |msg| "#{field}: #{msg}" }
        end
        { plan: nil, errors: error_messages }
      else
        { plan: nil, errors: [error.message] }
      end
    end
  end
end

