# frozen_string_literal: true

module Types
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :username, String, null: false
    field :profile_image_url, String
    field :bio, String
    field :role, String
    field :email, String, null: false
    field :password_hash, String
    field :instagram_url, String
    field :is_paid_member, Boolean
    field :paid_start_date, GraphQL::Types::ISO8601Date
    field :paid_end_date, GraphQL::Types::ISO8601Date
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
