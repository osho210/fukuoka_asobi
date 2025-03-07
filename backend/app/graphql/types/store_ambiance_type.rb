module Types
  class StoreAmbianceType < Types::BaseObject
    field :id, ID, null: false
    field :ambiance_name, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    field :stores, [Types::StoreType], null: false
  end
end
