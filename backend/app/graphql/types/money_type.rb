module Types
  class MoneyType < Types::BaseObject
    field :amount, Float, null: true
    field :currency, String, null: true

    def amount
      (object[:units] || object['units'])&.to_f
    end

    def currency
      object[:currency_code] || object['currencyCode']
    end
  end
end
