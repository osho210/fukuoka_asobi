# frozen_string_literal: true

module Mutations
  class UpdateLicensedAsset < BaseMutation
    argument :id, ID, required: true
    argument :usable, Boolean, required: false
    argument :caption_note, String, required: false

    field :licensed_asset, Types::LicensedAssetType, null: true
    field :errors, [String], null: false

    def resolve(id:, usable: nil, caption_note: nil)
      licensed_asset = LicensedAsset.find(id)
      
      update_params = {}
      update_params[:usable] = usable unless usable.nil?
      update_params[:caption_note] = caption_note if caption_note

      if licensed_asset.update(update_params)
        { licensed_asset: licensed_asset, errors: [] }
      else
        { licensed_asset: nil, errors: licensed_asset.errors.full_messages }
      end
    rescue ActiveRecord::RecordNotFound
      { licensed_asset: nil, errors: ['画像が見つかりません'] }
    end
  end
end
