# frozen_string_literal: true

module Types
  class SubscriptionType < Types::BaseObject
    field :id, ID, null: false
    field :status, String, null: true
    field :current_period_end, String, null: true
    field :cancel_at_period_end, Boolean, null: true
    field :canceled_at, String, null: true

    def current_period_end
      return nil unless object

      Time.at(object.current_period_end).iso8601
    end

    def canceled_at
      return nil unless object.canceled_at

      Time.at(object.canceled_at).iso8601
    end
  end
end
