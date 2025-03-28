module Types
  class TravelSegmentType < Types::BaseObject
    field :from_spot, Types::SpotType, null: false
    field :to_spot, Types::SpotType, null: false
    field :distance, Float, null: true
    field :travel_time, Integer, null: true
    field :travel_method, String, null: false
  end
end
