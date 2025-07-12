module Types
  class PriceRangeType < Types::BaseObject
    field :start_price, Types::MoneyType, null: true
    field :end_price, Types::MoneyType, null: true
  end
end
