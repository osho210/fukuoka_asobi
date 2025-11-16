module Types
  class TravelDetailType < Types::BaseObject
    description "移動詳細情報"

    field :id, ID, null: false, description: "移動詳細ID"
    field :plan_detail_id, Integer, null: false, description: "プラン詳細ID"
    field :sequence_number, Integer, null: false, description: "移動順序番号"
    field :travel_method, String, null: false, description: "移動方法"
    field :travel_time, Integer, null: false, description: "移動時間（分）"
    field :notes, String, null: true, description: "メモ"
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false, description: "作成日時"
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false, description: "更新日時"

    # 関連するプラン詳細を取得
    field :plan_detail, Types::PlanDetailType, null: false, description: "関連するプラン詳細"
    def plan_detail
      object.plan_detail
    end
  end
end
