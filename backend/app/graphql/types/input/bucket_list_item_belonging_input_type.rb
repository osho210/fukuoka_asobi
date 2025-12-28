# frozen_string_literal: true

module Types
  module Input
    class BucketListItemBelongingInputType < Types::BaseInputObject
      argument :id, ID, required: false
      argument :name, String, required: true
      argument :note, String, required: false
      argument :sort_order, Integer, required: false
      argument :_destroy, Boolean, required: false
    end
  end
end
