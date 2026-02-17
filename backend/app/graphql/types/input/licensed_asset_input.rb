# frozen_string_literal: true

module Types
  module Input
    class LicensedAssetInput < Types::BaseInputObject
      argument :spot_id, Integer, required: true
      argument :consent_agreement_id, Integer, required: true
      argument :asset_type, Types::AssetTypeEnum, required: true
      argument :asset_url, String, required: false
      argument :asset_file, String, required: false # Base64 encoded image
      argument :source_url, String, required: false
      argument :caption_note, String, required: false
    end
  end
end
