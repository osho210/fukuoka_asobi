module Types
  class PlanDetailInputType < Types::BaseInputObject
    description "プラン詳細の入力タイプ"

    argument :id, ID, required: false, description: "プラン詳細ID（更新時のみ）"
    argument :step_number, Integer, required: true, description: "ステップ番号"
    argument :step_name, String, required: true, description: "ステップ名"
    argument :step_description, String, required: false, description: "ステップ説明"
    argument :spot_id, ID, required: false, description: "スポットID"
    argument :comment, String, required: false, description: "コメント"
    argument :start_datetime, GraphQL::Types::ISO8601DateTime, required: false, description: "開始日時"
    argument :end_datetime, GraphQL::Types::ISO8601DateTime, required: false, description: "終了日時"
    argument :budget, Float, required: false, description: "予算"
    argument :notes, String, required: false, description: "備考"
    argument :travel_details, [Types::TravelDetailInputType], required: false, description: "移動詳細リスト"
  end
end
