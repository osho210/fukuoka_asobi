module Types
  class AreaType < Types::BaseObject
    field :id, ID, null: false
    field :area_name, String, null: false
    field :district_id, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :district, Types::DistrictType, null: false
    field :stores, [Types::StoreType], null: false
  end
end
