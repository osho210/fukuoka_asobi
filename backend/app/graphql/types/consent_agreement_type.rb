# frozen_string_literal: true

module Types
  class ConsentAgreementType < Types::BaseObject
    field :id, ID, null: false
    field :consent_request_id, Integer, null: false
    field :consent_request, Types::ConsentRequestType, null: false
    field :agreed_at, GraphQL::Types::ISO8601DateTime, null: false
    field :agreement_version, String, null: false
    field :agreement_snapshot_json, String, null: false
    field :signer_name, String, null: false
    field :signer_instagram, String, null: true
    field :photographer_name, String, null: true
    field :tag_store_requested, Boolean, null: false
    field :tag_photographer_requested, Boolean, null: false
    field :tag_accounts_text, String, null: true
    field :rights_confirmed, Boolean, null: false
    field :ip_address, String, null: true
    field :user_agent, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :licensed_assets, [Types::LicensedAssetType], null: true

    def agreement_snapshot_json
      object.agreement_snapshot.to_json
    end
  end
end
