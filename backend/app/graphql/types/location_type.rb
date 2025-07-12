module Types
  class LocationType < Types::BaseObject
    description "位置情報"

    field :latitude, Float, null: false, description: "緯度"
    field :longitude, Float, null: false, description: "経度"
  end
end
