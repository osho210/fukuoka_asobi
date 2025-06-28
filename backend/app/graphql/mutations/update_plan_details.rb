module Mutations
  class UpdatePlanDetails < BaseMutation
    # 入力フィールド
    argument :plan_id, ID, required: true
    argument :plan_details, [Types::PlanDetailInputType], required: true

    # 出力フィールド
    field :plan_details, [Types::PlanDetailType], null: true
    field :play_plan, Types::PlayPlanType, null: true
    field :errors, [String], null: false

    def resolve(plan_id:, plan_details:)
      # プランの取得
      play_plan = PlayPlan.find_by(id: plan_id)

      unless play_plan
        return {
          plan_details: nil,
          play_plan: nil,
          errors: ["プランが見つかりません"]
        }
      end

      # 現在のユーザーを取得
      user = context[:current_user]

      # 権限チェック（オプション）
      # if play_plan.user_id.present? && play_plan.user_id != user&.id
      #   return {
      #     plan_details: nil,
      #     play_plan: nil,
      #     errors: ["このプランを編集する権限がありません"]
      #   }
      # end

      # トランザクションで一括更新
      updated_details = []
      errors = []

      ActiveRecord::Base.transaction do
        plan_details.each do |detail_input|
          detail_attrs = detail_input.to_h.except(:id)
          plan_detail = PlanDetail.find_by(id: detail_input[:id])

          if plan_detail && plan_detail.plan_id.to_s == plan_id.to_s
            # 時間の整合性チェック
            if detail_attrs[:start_datetime] && detail_attrs[:end_datetime]
              if detail_attrs[:start_datetime] >= detail_attrs[:end_datetime]
                errors << "ステップ #{plan_detail.step_number}: 開始時間は終了時間より前である必要があります"
                next
              end
            end

            if plan_detail.update(detail_attrs)
              updated_details << plan_detail
            else
              errors += plan_detail.errors.full_messages.map { |msg| "ステップ #{plan_detail.step_number}: #{msg}" }
            end
          else
            errors << "ID: #{detail_input[:id]} のプラン詳細が見つかりません"
          end
        end

        # 時間的整合性の追加チェック（ステップ間の順序）
        sorted_details = updated_details.sort_by(&:step_number)
        sorted_details.each_with_index do |detail, index|
          next if index == 0 # 最初のステップはスキップ
          prev_detail = sorted_details[index - 1]

          if detail.start_datetime && prev_detail.end_datetime && detail.start_datetime < prev_detail.end_datetime
            errors << "ステップ #{detail.step_number}: 開始時間は前のステップの終了時間より後である必要があります"
          end
        end

        # 総予算の更新
        if updated_details.present? && errors.empty?
          total_budget = updated_details.sum(&:budget)
          play_plan.update(total_budget: total_budget)
        end

        # エラーがあればロールバック
        raise ActiveRecord::Rollback if errors.any?
      end

      if errors.empty?
        {
          plan_details: play_plan.plan_details.ordered,
          play_plan: play_plan,
          errors: []
        }
      else
        {
          plan_details: nil,
          play_plan: nil,
          errors: errors
        }
      end
    end
  end
end
