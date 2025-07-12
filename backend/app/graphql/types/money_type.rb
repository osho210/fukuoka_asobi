module Types
  class MoneyType < Types::BaseObject
    field :amount, Float, null: true
    field :currency, String, null: true
  end
end
