# frozen_string_literal: true

module Types
  class BucketListItemBelongingType < Types::BaseObject
    field :id, ID, null: false
    field :bucket_list_item, Types::BucketListItemType, null: false
    field :bucket_list_item_id, ID, null: false
    field :name, String, null: false
    field :note, String, null: true
    field :sort_order, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
