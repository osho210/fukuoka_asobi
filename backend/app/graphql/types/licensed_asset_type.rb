# frozen_string_literal: true

module Types
  class LicensedAssetType < Types::BaseObject
    field :id, ID, null: false
    field :spot_id, Integer, null: false
    field :spot, Types::SpotType, null: false
    field :consent_agreement_id, Integer, null: false
    field :consent_agreement, Types::ConsentAgreementType, null: false
    field :asset_type, Types::AssetTypeEnum, null: false
    field :asset_url, String, null: true
    field :source_url, String, null: true
    field :caption_note, String, null: true
    field :usable, Boolean, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :image_url, String, null: true

    def image_url
      return object.asset_url if object.asset_type == 'URL'
      return nil unless object.asset_file.attached?

      convert_storage_url(object.asset_file.url)
    end
  end
end
