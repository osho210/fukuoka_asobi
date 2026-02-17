# frozen_string_literal: true

module Mutations
  class CreateConsentAgreement < BaseMutation
    argument :input, Types::Input::ConsentAgreementInput, required: true

    field :consent_agreement, Types::ConsentAgreementType, null: true
    field :errors, [String], null: false

    def resolve(input:)
      consent_request = ConsentRequest.find_by(token: input[:token])

      unless consent_request
        return { consent_agreement: nil, errors: ['無効なトークンです'] }
      end

      unless consent_request.can_be_approved?
        return { consent_agreement: nil, errors: ['この依頼は承諾できません（期限切れまたは既に処理済み）'] }
      end

      unless input[:rights_confirmed]
        return { consent_agreement: nil, errors: ['権利確認にチェックを入れてください'] }
      end

      consent_agreement = ConsentAgreement.new(
        consent_request: consent_request,
        signer_name: input[:signer_name],
        signer_instagram: input[:signer_instagram],
        photographer_name: input[:photographer_name],
        tag_store_requested: input[:tag_store_requested] || false,
        tag_photographer_requested: input[:tag_photographer_requested] || false,
        tag_accounts_text: input[:tag_accounts_text],
        rights_confirmed: input[:rights_confirmed],
        ip_address: input[:ip_address],
        user_agent: input[:user_agent]
      )

      if consent_agreement.save
        { consent_agreement: consent_agreement, errors: [] }
      else
        { consent_agreement: nil, errors: consent_agreement.errors.full_messages }
      end
    end
  end
end
