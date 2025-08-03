module Types
  class MenuType < Types::BaseObject
    field :id, ID, null: false
    field :menu_name, String, null: false
    field :price, Float, null: true
    field :description, String, null: true
    field :image_url, Types::ImageType, null: true, description: "メニューの画像URL"
    field :menu_category, Types::MenuCategoryType, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    field :spots, [Types::SpotType], null: false

    # TODO: 開発環境ではMinIOのURLをローカルに置き換える
    def image_url
      return nil unless object.image.attached?

      {
        id: object.image.id,
        url: object.image.url.gsub("http://minio:9000", "http://localhost:9000")
      }
    end
  end
end
