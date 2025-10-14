# ActiveStorage::Attachmentモデルの拡張
Rails.application.config.to_prepare do
  ActiveStorage::Attachment.class_eval do
    has_one :play_plan_image_property, dependent: :destroy
  end
end
