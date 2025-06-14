module Types
  class NewsType < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: false
    field :body, String, null: false
    field :published_at, GraphQL::Types::ISO8601DateTime, null: true
    field :status, Types::StatusEnumType, null: true
    field :image_url, String, null: true
    field :author, Types::UserType, null: true
    field :category, Types::CategoryType, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
