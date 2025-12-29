# frozen_string_literal: true

module Types
  class BucketListItemType < Types::BaseObject
    field :id, ID, null: false
    field :layout_bucket, Types::LayoutBucketType, null: false
    field :layout_bucket_id, [ID], null: false
    field :title, String, null: false
    field :content, String, null: true
    field :area_text, String, null: true
    field :meeting_place_name, String, null: true
    field :meeting_place_address, String, null: true
    field :meeting_place_google_place_id, String, null: true
    field :stay_minutes, Integer, null: true
    field :meeting_time, GraphQL::Types::ISO8601DateTime, null: true
    field :start_time, GraphQL::Types::ISO8601DateTime, null: true
    field :end_time, GraphQL::Types::ISO8601DateTime, null: true
    field :cost_min, Integer, null: true
    field :cost_max, Integer, null: true
    field :weather, String, null: false
    field :status, String, null: false
    field :published_at, GraphQL::Types::ISO8601DateTime, null: true
    field :bucket_list_item_belongings, [ Types::BucketListItemBelongingType ], null: false
    field :bucket_list_item_references, [ Types::BucketListItemReferenceType ], null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    # layout_bucket_id を配列で返す resolver
    def layout_bucket_id
      [object.layout_bucket_id]
    end
  end
end
