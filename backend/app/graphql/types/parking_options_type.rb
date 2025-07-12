module Types
  class ParkingOptionsType < Types::BaseObject
    field :free_parking_lot, Boolean, null: true
    field :paid_parking_lot, Boolean, null: true
    field :free_street_parking, Boolean, null: true
    field :paid_street_parking, Boolean, null: true
    field :valet_parking, Boolean, null: true
    field :free_garage_parking, Boolean, null: true
    field :paid_garage_parking, Boolean, null: true
  end
end
