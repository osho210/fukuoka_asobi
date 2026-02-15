# frozen_string_literal: true

module Mutations
  class CreateConsentRequest < BaseMutation
    argument :input, Types::Input::ConsentRequestInput, required: true

    field :consent_request, Types::ConsentRequestType, null: true
    field :errors, [String], null: false

    def resolve(input:)
      consent_request = ConsentRequest.new(
        spot_id: input[:spot_id],
        consenter_type: input[:consenter_type],
        consenter_display_name: input[:consenter_display_name],
        contact_hint: input[:contact_hint],
        instagram_post_url: input[:instagram_post_url],
        message_template: input[:message_template],
        created_by: input[:created_by] || context[:current_user]&.id,
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
