# frozen_string_literal: true

class ImageUploadService
  # Base64エンコードされた画像をActive Storageに添付する
  # @param model [ActiveRecord::Base]
  # @param images [Array<String>]
  # @param prefix [String]
  # @param attachment_name [Symbol]
  def self.attach_base64_images(model, images, prefix: nil, attachment_name: :image)
    return unless images.present?

    images.each_with_index do |base64_image, index|
      begin
        # 画像データを文字列に変換
        image_string = base64_image.to_s
        
        # Base64データからファイル形式を判別
        match_data = image_string.match(/data:(.*?);/)
        raise "画像フォーマットが不正です（data:image/xxx;base64,... の形式である必要があります）" if match_data.nil?
        
        content_type = match_data[1]
        raise "画像のContent-Typeが不正です" if content_type.blank?

        # Base64データ部分のみを抽出
        encoded_image = image_string.split(",")[1]
        raise "画像データが空です" if encoded_image.blank?

        # デコード
        decoded_image = Base64.decode64(encoded_image)
        raise "画像データのデコードに失敗しました" if decoded_image.blank?

        # ファイル名を生成
        model_prefix = prefix || model.class.name.downcase
        extension = content_type.split('/')[1]
        filename = "#{model_prefix}_#{model.id}_#{Time.current.to_i}_#{index}.#{extension}"

        # 添付
        attachment = {
          io: StringIO.new(decoded_image),
          filename: filename,
          content_type: content_type
        }

        if attachment_name == :images
          model.images.attach(attachment)
        else
          model.image.attach(attachment)
        end

        # 添付できているか確認
        if attachment_name == :images
          raise "画像の添付に失敗しました" unless model.images.attached?
        else
          raise "画像の添付に失敗しました" unless model.image.attached?
        end
      rescue => e
        Rails.logger.error("[ImageUploadService] 画像添付エラー: #{e.message}")
        raise StandardError, "画像の添付に失敗しました: #{e.message}"
      end
    end
  end

  def self.delete_images(model, delete_image_ids, attachment_name: :images)
    return unless delete_image_ids.present?

    delete_image_ids.each do |image_id|
      begin
        if attachment_name == :images
          image_to_delete = model.images.find_by(id: image_id)
        else
          image_to_delete = model.image if model.image.attached? && model.image.id.to_s == image_id.to_s
        end
        image_to_delete&.purge
      rescue => e
        Rails.logger.error("[ImageUploadService] 画像削除エラー: #{e.message}")
        raise StandardError, "画像の削除に失敗しました: #{e.message}"
      end
    end
  end

  def self.delete_single_image(model)
    model.image.purge if model.image.attached?
  rescue => e
    Rails.logger.error("[ImageUploadService] 単一画像削除エラー: #{e.message}")
    raise StandardError, "画像の削除に失敗しました: #{e.message}"
  end
end
