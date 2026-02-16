# frozen_string_literal: true

module Types
  module Input
    class ConsentAgreementInput < Types::BaseInputObject
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
    end
  end
end
