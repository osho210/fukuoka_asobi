module Types
  class PlayPlanWithDetailsInputType < Types::BaseInputObject
    description "プラン一括編集の入力タイプ"

    argument :id, ID, required: false, description: "プランID（更新時のみ）"
    argument :plan_name, String, required: true, description: "プラン名"
    argument :description, String, required: false, description: "プラン説明"
    argument :status, Types::StatusEnumType, required: true, description: "ステータス（公開／下書き）"
    argument :trip_type, Types::TripTypeEnum, required: true, description: "旅行タイプ（日帰り／泊まり）"
    argument :total_budget, Float, required: false, description: "総予算"
    argument :location, String, required: false, description: "場所"
    argument :start_datetime, GraphQL::Types::ISO8601DateTime, required: false, description: "開始日時"
    argument :end_datetime, GraphQL::Types::ISO8601DateTime, required: false, description: "終了日時"
    argument :image_url, String, required: false, description: "画像URL"
    argument :tags, String, required: false, description: "タグ"
    argument :recommend_users, [ID], required: false, description: "おすすめ対象IDリスト"
    argument :plan_details, [Types::PlanDetailInputType], required: true, description: "プラン詳細リスト"
  end
end
