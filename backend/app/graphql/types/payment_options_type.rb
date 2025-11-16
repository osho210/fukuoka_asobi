module Types
  class PaymentOptionsType < Types::BaseObject
    field :accepts_credit_cards, Boolean, null: false
    field :accepts_debit_cards, Boolean, null: false
    field :accepts_cash_only, Boolean, null: false
    field :accepts_nfc, Boolean, null: false
  end
end
