# frozen_string_literal: true

module Mutations
  class CreateLicensedAsset < BaseMutation
    argument :spot_id, Integer, required: true
    argument :consent_agreement_id, Integer, required: false
    argument :asset_type, Types::AssetTypeEnum, required: true
    argument :asset_url, String, required: false
    argument :asset_file, String, required: false, description: "Base64エンコードされた画像データ"
    argument :source_url, String, required: false
    argument :caption_note, String, required: false

    field :licensed_asset, Types::LicensedAssetType, null: true
    field :errors, [String], null: false

    def resolve(**args)
      # asset_type が UPLOAD の場合は asset_file が必須
      if args[:asset_type] == 'UPLOAD' && args[:asset_file].blank?
        return { licensed_asset: nil, errors: ['ファイルがアップロードされていません'] }
      end

      # asset_type が URL の場合は asset_url が必須
      if args[:asset_type] == 'URL' && args[:asset_url].blank?
        return { licensed_asset: nil, errors: ['画像URLを指定してください'] }
      end

      licensed_asset = LicensedAsset.new(
        spot_id: args[:spot_id],
        consent_agreement_id: args[:consent_agreement_id],
        asset_type: args[:asset_type],
        asset_url: args[:asset_url],
        source_url: args[:source_url],
        caption_note: args[:caption_note]
      )

      # Base64画像データを処理
      if args[:asset_type] == 'UPLOAD' && args[:asset_file].present?
        begin
          # Base64データからファイル形式を判別
          base64_data = args[:asset_file]

          # data:image/jpeg;base64, のような形式の場合
          if base64_data.include?(',')
            content_type = base64_data.match(/data:(.*?);/)[1]
            encoded_image = base64_data.split(',')[1]
          else
            # Base64データのみの場合はデフォルトでJPEG
            content_type = 'image/jpeg'
            encoded_image = base64_data
          end

          # デコード
          decoded_image = Base64.decode64(encoded_image)

          # ファイル名を生成
          extension = content_type.split('/')[1]
          filename = "licensed_asset_#{Time.current.to_i}.#{extension}"

          # 添付
          licensed_asset.asset_file.attach(
            io: StringIO.new(decoded_image),
            filename: filename,
            content_type: content_type
          )
        rescue StandardError => e
          return { licensed_asset: nil, errors: ["画像の添付に失敗しました: #{e.message}"] }
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
