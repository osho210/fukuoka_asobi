module Types
  class DistrictType < Types::BaseObject
    field :id, ID, null: false
    field :district_name, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :areas, [Types::AreaType], null: false
    field :stores, [Types::StoreType], null: false
  end
end
