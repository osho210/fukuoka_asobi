module Types
  class PriceRangeType < Types::BaseObject
    field :start_price, Types::MoneyType, null: false
    field :end_price, Types::MoneyType, null: false

    def start_price
      object[:start_price] || object['startPrice']
    end

    def end_price
      object[:end_price] || object['endPrice']
    end
  end
end
