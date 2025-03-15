module Types
  class PlayPlanType < Types::BaseObject
    implements GraphQL::Types::Relay::Node
    global_id_field :id

    field :user_id, Integer, null: true
    field :user, Types::UserType, null: true
    def user
      object.user
    end
    field :plan_name, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :start_datetime, GraphQL::Types::ISO8601DateTime, null: true
    field :end_datetime, GraphQL::Types::ISO8601DateTime, null: true
    field :description, String, null: true
    field :status, Types::PlayPlanStatusEnum, null: false
    field :favorite_count, Integer, null: false
    field :rating, Float, null: false
    field :review_count, Integer, null: false
    field :image_url, String, null: true
    field :tags, String, null: true
    field :location, String, null: true
    field :published_at, GraphQL::Types::ISO8601DateTime, null: true
    field :trip_type, Types::TripTypeEnum, null: false
    field :total_budget, Float, null: true
    field :recommended_for, String, null: true

    # 関連するプラン詳細を取得
    field :plan_details, [Types::PlanDetailType], null: true
    def plan_details
      object.plan_details.ordered
    end
  end
end
