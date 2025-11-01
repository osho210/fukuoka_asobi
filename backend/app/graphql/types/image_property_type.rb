module Types
  class ImagePropertyType < Types::BaseObject
    description "画像とそのプロパティ"

    field :attachment_id, ID, null: false, description: "ActiveStorage::AttachmentのID"
    field :url, String, null: false, description: "画像のURL"
    field :is_selected, Boolean, null: false, description: "表示対象かどうか"
    field :position, Integer, null: false, description: "表示順"
    field :comment, String, null: true, description: "コメント"
  end
end
