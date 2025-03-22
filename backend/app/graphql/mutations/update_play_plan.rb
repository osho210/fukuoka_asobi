module Mutations
  class UpdatePlayPlan < BaseMutation
    # 入力フィールド
    argument :id, ID, required: true
    argument :plan_name, String, required: false
    argument :description, String, required: false
    argument :status, Types::PlayPlanStatusEnum, required: false
    argument :trip_type, Types::TripTypeEnum, required: false
    argument :total_budget, Float, required: false
    argument :location, String, required: false
    argument :start_datetime, GraphQL::Types::ISO8601DateTime, required: false
    argument :end_datetime, GraphQL::Types::ISO8601DateTime, required: false
    argument :image_url, String, required: false
    argument :tags, String, required: false
    argument :recommended_for_ids, [ID], required: false

    # 出力フィールド
    field :play_plan, Types::PlayPlanType, null: true
    field :errors, [String], null: false

    def resolve(
      id:,
      plan_name: nil,
      description: nil,
      status: nil,
      trip_type: nil,
      total_budget: nil,
      location: nil,
      start_datetime: nil,
      end_datetime: nil,
      image_url: nil,
      tags: nil,
      recommended_for_ids: nil
    )
      # プランの取得
      play_plan = PlayPlan.find_by(id: id)

      unless play_plan
        return {
          play_plan: nil,
          errors: ["プランが見つかりません"]
        }
      end

      # 現在のユーザーを取得
      user = context[:current_user]

      # 権限チェック（オプション）
      # if play_plan.user_id.present? && play_plan.user_id != user&.id
      #   return {
      #     play_plan: nil,
      #     errors: ["このプランを編集する権限がありません"]
      #   }
      # end

      # 更新可能なフィールドを設定
      play_plan.plan_name = plan_name if plan_name.present?
      play_plan.description = description if description.present?
      play_plan.status = status if status.present?
      play_plan.trip_type = trip_type if trip_type.present?
      play_plan.total_budget = total_budget if total_budget.present?
      play_plan.location = location if location.present?
      play_plan.start_datetime = start_datetime if start_datetime.present?
      play_plan.end_datetime = end_datetime if end_datetime.present?
      play_plan.image_url = image_url if image_url.present?
      play_plan.tags = tags if tags.present?

      # おすすめ対象の関連付けを更新
      if recommended_for_ids.present?
        # 既存の関連をクリア
        play_plan.play_plan_recommended_fors.destroy_all

        # 新しい関連を作成
        recommended_for_ids.each do |recommended_for_id|
          recommended_for = RecommendedFor.find_by(id: recommended_for_id)
          play_plan.recommended_fors << recommended_for if recommended_for
        end
      end

      if play_plan.save
        {
          play_plan: play_plan,
          errors: []
        }
      else
        {
          play_plan: nil,
          errors: play_plan.errors.full_messages
        }
      end
    end
  end
end
