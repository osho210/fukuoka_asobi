module Types
  class PaymentOptionsType < Types::BaseObject
    field :accepts_credit_cards, Boolean, null: true
    field :accepts_debit_cards, Boolean, null: true
    field :accepts_cash_only, Boolean, null: true
    field :accepts_nfc, Boolean, null: true
  end
end
