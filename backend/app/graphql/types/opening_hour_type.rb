module Types
  class OpeningHourType < Types::BaseObject
    field :id, ID, null: false
    field :spot_id, Integer, null: false
    field :day_of_week, String, null: false
    field :open_time, GraphQL::Types::ISO8601DateTime, null: false
    field :close_time, GraphQL::Types::ISO8601DateTime, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    field :spot, Types::SpotType, null: false
  end
end
