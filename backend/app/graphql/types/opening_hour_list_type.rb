# frozen_string_literal: true

module Types
  class OpeningHourListType < Types::BaseObject
    field :day_of_week, String, null: false
    field :business_hour, String, null: false
  end
end
