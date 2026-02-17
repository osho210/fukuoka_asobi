# frozen_string_literal: true

module Types
  module Input
    class ConsentRequestInput < Types::BaseInputObject
      argument :spot_id, Integer, required: true
      argument :consenter_type, Types::ConsenterTypeEnum, required: true
      argument :consenter_display_name, String, required: true
      argument :contact_hint, String, required: false
      argument :instagram_post_url, String, required: false
      argument :message_template, String, required: false
      argument :created_by, Integer, required: false
    end
  end
end
