# frozen_string_literal: true

module Types
  class BucketListItemReferenceType < Types::BaseObject
    field :id, ID, null: false
    field :bucket_list_item, Types::BucketListItemType, null: false
    field :bucket_list_item_id, ID, null: false
    field :title, String, null: true
    field :url, String, null: false
    field :reference_type, String, null: false
    field :sort_order, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
