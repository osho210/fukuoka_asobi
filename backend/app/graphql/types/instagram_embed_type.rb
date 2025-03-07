module Types
  class InstagramEmbedType < Types::BaseObject
    field :id, ID, null: false
    field :instagram_embed_name, String, null: false
    field :embed_code, String, null: false
    field :embed_url, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    field :stores, [Types::StoreType], null: false
  end
end
