module Types
  class ParkingOptionsType < Types::BaseObject
    field :free_parking_lot, Boolean, null: false
    field :paid_parking_lot, Boolean, null: false
    field :free_street_parking, Boolean, null: false
    field :paid_street_parking, Boolean, null: false
    field :valet_parking, Boolean, null: false
    field :free_garage_parking, Boolean, null: false
    field :paid_garage_parking, Boolean, null: false
  end
end
