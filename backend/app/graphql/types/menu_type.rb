module Types
  class MenuType < Types::BaseObject
    field :id, ID, null: false
    field :menu_name, String, null: false
    field :price, Float, null: true
    field :description, String, null: true
    field :image_filename, String, null: true, description: "メニューの画像ファイル名"
    field :menu_category, Types::MenuCategoryType, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    field :spots, [Types::SpotType], null: false
  end
end
