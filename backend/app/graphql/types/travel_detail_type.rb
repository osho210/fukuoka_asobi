module Types
  class TravelDetailType < Types::BaseObject
    implements GraphQL::Types::Relay::Node
    global_id_field :id

    field :plan_detail_id, Integer, null: false
    field :sequence_number, Integer, null: false
    field :travel_method, String, null: false
    field :travel_time, Integer, null: true
    field :notes, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    # 関連するプラン詳細情報を取得
    field :plan_detail, Types::PlanDetailType, null: false
    def plan_detail
      object.plan_detail
    end
  end
end
