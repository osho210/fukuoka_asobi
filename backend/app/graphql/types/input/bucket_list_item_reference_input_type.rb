# frozen_string_literal: true

module Types
  module Input
    class BucketListItemReferenceInputType < Types::BaseInputObject
      argument :id, ID, required: false
      argument :title, String, required: false
      argument :url, String, required: true
      argument :reference_type, String, required: false
      argument :sort_order, Integer, required: false
      argument :_destroy, Boolean, required: false
    end
  end
end
