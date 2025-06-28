module Mutations
  class UpdatePlanDetail < BaseMutation
    # 入力フィールド
    argument :id, ID, required: true
    argument :step_number, Integer, required: false
    argument :step_name, String, required: false
    argument :step_description, String, required: false
    argument :start_datetime, GraphQL::Types::ISO8601DateTime, required: false
    argument :end_datetime, GraphQL::Types::ISO8601DateTime, required: false
    argument :budget, Float, required: false
    argument :spot_id, Integer, required: false
    argument :comment, String, required: false
    argument :notes, String, required: false

    # 出力フィールド
    field :plan_detail, Types::PlanDetailType, null: true
    field :errors, [String], null: false

    def resolve(id:, **attributes)
      # プラン詳細の取得
      plan_detail = PlanDetail.find_by(id: id)

      unless plan_detail
        return {
          plan_detail: nil,
          errors: ["プラン詳細が見つかりません"]
        }
      end

      # 現在のユーザーを取得
      user = context[:current_user]

      # 権限チェック（オプション）
      # if plan_detail.play_plan.user_id.present? && plan_detail.play_plan.user_id != user&.id
      #   return {
      #     plan_detail: nil,
      #     errors: ["このプラン詳細を編集する権限がありません"]
      #   }
      # end

      # 時間の整合性チェック
      if attributes[:start_datetime] && attributes[:end_datetime]
        if attributes[:start_datetime] >= attributes[:end_datetime]
          return {
            plan_detail: nil,
            errors: ["開始時間は終了時間より前である必要があります"]
          }
        end
      end

      # 更新可能なフィールドを設定
      if plan_detail.update(attributes)
        {
          plan_detail: plan_detail,
          errors: []
        }
      else
        {
          plan_detail: nil,
          errors: plan_detail.errors.full_messages
        }
      end
    end
  end
end
