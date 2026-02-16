# frozen_string_literal: true

module Mutations
  class CreateConsentRequest < BaseMutation
    argument :spot_id, Integer, required: true
    argument :consenter_type, Types::ConsenterTypeEnum, required: true
    argument :consenter_display_name, String, required: true
    argument :contact_hint, String, required: false
    argument :instagram_post_url, String, required: false
    argument :message_template, String, required: false
    argument :created_by, Integer, required: false

    field :consent_request, Types::ConsentRequestType, null: true
    field :errors, [String], null: false

    def resolve(
      spot_id:,
      consenter_type:,
      consenter_display_name:,
      contact_hint: nil,
      instagram_post_url: nil,
      message_template: nil,
      created_by: nil
    )
      consent_request = ConsentRequest.new(
        spot_id: spot_id,
        consenter_type: consenter_type,
        consenter_display_name: consenter_display_name,
        contact_hint: contact_hint,
        instagram_post_url: instagram_post_url,
        message_template: message_template,
        created_by: created_by || context[:current_user]&.id,
        status: 'SENT'
      )

      if consent_request.save
        { consent_request: consent_request, errors: [] }
      else
        { consent_request: nil, errors: consent_request.errors.full_messages }
      end
    end
  end
end