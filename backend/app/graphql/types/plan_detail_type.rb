module Types
  class PlanDetailType < Types::BaseObject
    implements GraphQL::Types::Relay::Node
    field :id, ID, null: false
    field :plan_id, Integer, null: false
    field :step_number, Integer, null: false
    field :step_name, String, null: false
    field :step_description, String, null: false
    field :spot_id, Integer, null: false
    field :comment, String, null: false
    field :start_time, String, null: false
    field :end_time, String, null: false
    field :duration_minutes, Integer, null: false
    field :budget, Float, null: false
    field :notes, String, null: true
    field :planner_title, String, null: false
    field :planner_description, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    # 関連するスポット情報を取得
    field :spot, Types::SpotType, null: true
    def spot
      object.spot
    end

    # 関連するプラン情報を取得
    field :play_plan, Types::PlayPlanType, null: false
    def play_plan
      object.play_plan
    end

    # 関連する移動詳細情報を取得
    field :travel_details, [Types::TravelDetailType], null: false
    def travel_details
      object.travel_details
    end

    # 内部的に日付を保持してしまうため、表示用にフォーマットする
    def start_time
      object.start_time&.strftime("%H:%M")
    end

    def end_time
      object.end_time&.strftime("%H:%M")
    end
  end
end
