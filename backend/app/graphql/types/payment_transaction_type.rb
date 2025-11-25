# frozen_string_literal: true

module Types
  class PaymentTransactionType < Types::BaseObject
    field :id, ID, null: false
    field :amount, Float, null: false
    field :currency, String, null: false
    field :status, String, null: false
    field :paid_at, String, null: true
    field :created_at, String, null: false

    def paid_at
      object.paid_at&.iso8601
    end

    def created_at
      object.created_at.iso8601
    end
  end
end
