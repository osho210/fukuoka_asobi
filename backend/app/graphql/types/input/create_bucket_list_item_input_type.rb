# frozen_string_literal: true

module Types
  module Input
    class CreateBucketListItemInputType < Types::BaseInputObject
      argument :layout_bucket_id, ID, required: true
      argument :title, String, required: true
      argument :content, String, required: false
      argument :area_text, String, required: false
      argument :meeting_place_name, String, required: false
      argument :meeting_place_address, String, required: false
      argument :meeting_place_google_place_id, String, required: false
      argument :stay_minutes, Integer, required: false
      argument :meeting_time, GraphQL::Types::ISO8601DateTime, required: false
      argument :start_time, GraphQL::Types::ISO8601DateTime, required: false
      argument :end_time, GraphQL::Types::ISO8601DateTime, required: false
      argument :cost_min, Integer, required: false
      argument :cost_max, Integer, required: false
      argument :weather, String, required: false
      argument :status, String, required: false
      argument :published_at, GraphQL::Types::ISO8601DateTime, required: false
      argument :bucket_list_item_belongings_attributes, [Types::Input::BucketListItemBelongingInputType], required: false
      argument :bucket_list_item_references_attributes, [Types::Input::BucketListItemReferenceInputType], required: false
    end
  end
end
