# frozen_string_literal: true

module Types
  class LayoutBucketType < Types::BaseObject
    field :id, ID, null: false
    field :key, String, null: false
    field :name, String, null: false
    field :template_key, String, null: false
    field :theme_key, String, null: false
    field :shift, String, null: false
    field :tilt, String, null: false
    field :depth, String, null: false
    field :status, String, null: false
    field :sort_order, Integer, null: false
    field :bucket_list_items, [ Types::BucketListItemType ], null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
