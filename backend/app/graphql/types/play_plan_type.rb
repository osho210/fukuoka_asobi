module Types
  class PlayPlanType < Types::BaseObject
    field :id, Integer, null: false

    field :user_id, Integer, null: true
    field :user, Types::UserType, null: true
    def user
      object.user
    end
    field :plan_name, String, null: false
    field :plan_id, Integer, null: false
    field :start_datetime, GraphQL::Types::ISO8601DateTime, null: true
    field :end_datetime, GraphQL::Types::ISO8601DateTime, null: true
    field :description, String, null: true
    field :status, Types::StatusEnumType, null: false
    field :favorite_count, Integer, null: false
    field :rating, Float, null: false
    field :review_count, Integer, null: false
    field :image_url, String, null: true
    field :tags, String, null: true
    field :location, String, null: true
    field :published_at, GraphQL::Types::ISO8601DateTime, null: true
    field :trip_type, Types::TripTypeEnum, null: false
    field :total_budget, Float, null: true
    field :planner_title, String, null: true
    field :planner_description, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    # 関連するプラン詳細を取得
    field :plan_details, [Types::PlanDetailType], null: true
    def plan_details
      object.plan_details.ordered
    end

    # おすすめ対象を取得
    field :recommended_fors, [Types::RecommendedForType], null: true

    # おすすめ対象の文字列表現を取得
    field :recommended_for_string, String, null: true

    # 現在のユーザーがお気に入り登録しているかどうか
    field :is_favorite, Boolean, null: false
    def is_favorite
      current_user = context[:current_user]
      return false unless current_user

      current_user.favorites.exists?(play_plan_id: object.id)
    end

    # お気に入り数を取得
    def favorite_count
      object.favorites.count
    end
  end
end
