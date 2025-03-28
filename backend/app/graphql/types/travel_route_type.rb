module Types
  class TravelRouteType < Types::BaseObject
    field :total_distance, Float, null: true
    field :total_travel_time, Integer, null: true
    field :travel_segments, [Types::TravelSegmentType], null: false
  end
end
