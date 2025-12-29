# frozen_string_literal: true

module Types
  module Input
    class UpdateLayoutBucketType < Types::BaseInputObject
      argument :key, String, required: false
      argument :name, String, required: false
      argument :template_key, String, required: false
      argument :theme_key, String, required: false
      argument :shift, String, required: false
      argument :tilt, String, required: false
      argument :depth, String, required: false
      argument :status, String, required: false
      argument :sort_order, Integer, required: false
    end
  end
end
