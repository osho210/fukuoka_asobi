# frozen_string_literal: true

module Mutations
  class CreateConsentAgreement < BaseMutation
    argument :token, String, required: true
    argument :signer_name, String, required: true
    argument :signer_instagram, String, required: false
    argument :photographer_name, String, required: false
    argument :tag_store_requested, Boolean, required: false
    argument :tag_photographer_requested, Boolean, required: false
    argument :tag_accounts_text, String, required: false
    argument :rights_confirmed, Boolean, required: true
    argument :ip_address, String, required: false
    argument :user_agent, String, required: false

    field :consent_agreement, Types::ConsentAgreementType, null: true
    field :errors, [String], null: false

    def resolve(token:, signer_name:, rights_confirmed:, signer_instagram: nil, photographer_name: nil, 
                tag_store_requested: false, tag_photographer_requested: false, tag_accounts_text: nil,
                ip_address: nil, user_agent: nil)
      consent_request = ConsentRequest.find_by(token: token)

      unless consent_request
        return { consent_agreement: nil, errors: ['無効なトークンです'] }
      end

      unless consent_request.can_be_approved?
        return { consent_agreement: nil, errors: ['この依頼は承諾できません（期限切れまたは既に処理済み）'] }
      end

      unless rights_confirmed
        return { consent_agreement: nil, errors: ['権利確認にチェックを入れてください'] }
      end

      consent_agreement = ConsentAgreement.new(
        consent_request: consent_request,
        signer_name: signer_name,
        signer_instagram: signer_instagram,
        photographer_name: photographer_name,
        tag_store_requested: tag_store_requested,
        tag_photographer_requested: tag_photographer_requested,
        tag_accounts_text: tag_accounts_text,
        rights_confirmed: rights_confirmed,
        ip_address: ip_address,
        user_agent: user_agent
      )

      if consent_agreement.save
        { consent_agreement: consent_agreement, errors: [] }
      else
        { consent_agreement: nil, errors: consent_agreement.errors.full_messages }
      end
    end
  end
end
