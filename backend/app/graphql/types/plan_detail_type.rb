module Types
  class PlanDetailType < Types::BaseObject
    implements GraphQL::Types::Relay::Node
    global_id_field :id

    field :plan_id, Integer, null: false
    field :step_number, Integer, null: false
    field :step_name, String, null: false
    field :step_description, String, null: true
    field :store_id, Integer, null: true
    field :comment, String, null: true
    field :start_datetime, GraphQL::Types::ISO8601DateTime, null: true
    field :end_datetime, GraphQL::Types::ISO8601DateTime, null: true
    field :budget, Float, null: true
    field :notes, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    # 関連する店舗情報を取得
    field :store, Types::StoreType, null: true
    def store
      object.store
    end

    # 関連するプラン情報を取得
    field :play_plan, Types::PlayPlanType, null: false
    def play_plan
      object.play_plan
    end
  end
end
