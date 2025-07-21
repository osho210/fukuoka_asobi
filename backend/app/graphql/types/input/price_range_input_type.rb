module Types
  module Input
    class PriceRangeInputType < Types::BaseInputObject
      description "Attributes for creating or updating a price range object"
      argument :start_price, Types::Input::MoneyInputType, required: false
      argument :end_price, Types::Input::MoneyInputType, required: false
    end
  end
end
