# frozen_string_literal: true

module Types
  class FavoriteType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, Integer, null: false
    field :play_plan_id, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    # 関連するユーザーとプランを取得するフィールド
    field :user, Types::UserType, null: false
    field :play_plan, Types::PlayPlanType, null: false
  end
end
