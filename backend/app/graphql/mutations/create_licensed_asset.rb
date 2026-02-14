# frozen_string_literal: true

module Mutations
  class CreateLicensedAsset < BaseMutation
    argument :input, Types::Input::LicensedAssetInput, required: true

    field :licensed_asset, Types::LicensedAssetType, null: true
    field :errors, [String], null: false

    def resolve(input:)
      licensed_asset = LicensedAsset.new(
        spot_id: input[:spot_id],
        consent_agreement_id: input[:consent_agreement_id],
        asset_type: input[:asset_type],
        asset_url: input[:asset_url],
        source_url: input[:source_url],
        caption_note: input[:caption_note]
      )

      # Handle file upload if asset_type is UPLOAD
      if input[:asset_type] == 'UPLOAD' && input[:asset_file].present?
        begin
          decoded_file = Base64.decode64(input[:asset_file])
          filename = "asset_#{Time.current.to_i}.jpg"
          licensed_asset.asset_file.attach(
            io: StringIO.new(decoded_file),
            filename: filename,
            content_type: 'image/jpeg'
          )
        rescue StandardError => e
          return { licensed_asset: nil, errors: ["画像の保存に失敗しました: #{e.message}"] }
        end
      end

      if licensed_asset.save
        { licensed_asset: licensed_asset, errors: [] }
      else
        { licensed_asset: nil, errors: licensed_asset.errors.full_messages }
      end
    end
  end
end
