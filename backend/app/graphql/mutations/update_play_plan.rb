# frozen_string_literal: true
module Mutations
  class UpdatePlayPlan < BaseMutation
    # 入力フィールド
    argument :id, ID, required: true
    argument :plan_name, String, required: false
    argument :description, String, required: false
    argument :status, Types::StatusEnumType, required: false
    argument :trip_type, Types::TripTypeEnum, required: false
    argument :total_budget, Float, required: false
    argument :location, String, required: false
    argument :start_datetime, GraphQL::Types::ISO8601DateTime, required: false
    argument :end_datetime, GraphQL::Types::ISO8601DateTime, required: false
    argument :image_url, String, required: false
    argument :review_count, Integer, required: false
    argument :favorite_count, Integer, required: false
    argument :published_at, GraphQL::Types::ISO8601DateTime, required: false
    argument :planner_title, String, required: false
    argument :planner_description, String, required: false
    argument :rating, Float, required: false
    argument :tags, String, required: false
    argument :recommended_for_ids, [ID], required: false
    argument :plan_details, [Types::PlanDetailInputType], required: false

    # 出力フィールド
    field :play_plan, Types::PlayPlanType, null: true
    field :plan_details, [Types::PlanDetailType], null: true
    field :errors, [String], null: false


    def resolve(**args)
      id = args.delete(:id)
      plan_input = args.compact.delete(:play_plan)
      plan_details_input = args.delete(:plan_details)

      play_plan = PlayPlan.find_by(id: id)
      return error_response(["プランが見つかりません"]) unless play_plan

      errors = []
      updated_details = []

      ActiveRecord::Base.transaction do
        # PlayPlan本体更新
        unless update_play_plan!(play_plan, args, errors)
          raise ActiveRecord::Rollback
        end

        # PlanDetail更新
        if plan_details_input.present?
          updated_details = update_plan_details!(
            plan_details_input,
            play_plan.id,
            errors
          )

          # ステップ間の時間整合性をチェック
          validate_step_sequence!(updated_details, errors)
        end

        # total_budget 自動計算
        if updated_details.present? && errors.empty? && !args[:total_budget].present?
          play_plan.total_budget = updated_details.sum(&:budget)
          play_plan.save!
        end

        raise ActiveRecord::Rollback if errors.any?
      end

      if errors.any?
        error_response(errors)
      else
        # 更新後に再取得する！
        reloaded_play_plan = PlayPlan
          .includes(
            :recommended_fors,
            plan_details: [:spot]
          )
          .find(play_plan.id)

        {
          play_plan: reloaded_play_plan,
          plan_details: reloaded_play_plan.plan_details.ordered,
          errors: []
        }
      end
    end


    private

    def update_play_plan!(play_plan, attrs, errors)
      return true if attrs.empty?

      unless play_plan.update(attrs)
        errors.concat(play_plan.errors.full_messages)
        return false
      end
      true
    end

    def update_plan_details!(plan_details_input, play_plan_id, errors)
      updated_details = []

      plan_details_input.each do |detail_input|
        detail_attrs = detail_input.to_h.except(:id)
        detail_id = detail_input[:id]

        plan_detail = PlanDetail.find_by(id: detail_id)

        unless plan_detail && plan_detail.plan_id.to_s == play_plan_id.to_s
          errors << "ID: #{detail_id} のプラン詳細が見つかりません"
          next
        end

        # ステップ内の開始・終了チェック
        if detail_attrs[:start_datetime] && detail_attrs[:end_datetime]
          if detail_attrs[:start_datetime] >= detail_attrs[:end_datetime]
            errors << "ステップ #{plan_detail.step_number}: 開始時間は終了時間より前である必要があります"
            next
          end
        end

        if plan_detail.update(detail_attrs)
          updated_details << plan_detail
        else
          plan_detail.errors.full_messages.each do |msg|
            errors << "ステップ #{plan_detail.step_number}: #{msg}"
          end
        end
      end

      updated_details
    end

    def validate_step_sequence!(details, errors)
      sorted = details.sort_by(&:step_number)
      sorted.each_cons(2) do |prev_detail, next_detail|
        if next_detail.start_datetime && prev_detail.end_datetime
          if next_detail.start_datetime < prev_detail.end_datetime
            errors << "ステップ #{next_detail.step_number}: 開始時間は前のステップの終了時間より後である必要があります"
          end
        end
      end
    end

    def error_response(messages)
      {
        play_plan: nil,
        plan_details: nil,
        errors: messages
      }
    end
  end
end
