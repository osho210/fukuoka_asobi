# frozen_string_literal: true

module Mutations
  class UpdateConsentRequestStatus < BaseMutation
    argument :id, ID, required: true
    argument :status, Types::ConsentRequestStatusEnum, required: true

    field :consent_request, Types::ConsentRequestType, null: true
    field :errors, [String], null: false

    def resolve(id:, status:)
      consent_request = ConsentRequest.find(id)
      
      if consent_request.update(status: status)
        { consent_request: consent_request, errors: [] }
      else
        { consent_request: nil, errors: consent_request.errors.full_messages }
      end
    rescue ActiveRecord::RecordNotFound
      { consent_request: nil, errors: ['承諾依頼が見つかりません'] }
    end
  end
end
