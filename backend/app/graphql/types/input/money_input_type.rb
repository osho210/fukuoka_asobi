module Types
  module Input
    class MoneyInputType < Types::BaseInputObject
      description "Attributes for creating or updating a money object"
      argument :units, Float, required: false, as: :amount
      argument :currency_code, String, required: false, as: :currency
    end
  end
end
