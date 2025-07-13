# backend/app/graphql/types/input/opening_hour_attributes.rb
# frozen_string_literal: true

module Types
  module Input
    class OpeningHourAttributes < BaseInputObject
      argument :id,          ID,      required: false
      argument :day_of_week, String,  required: true
      argument :open_time,   String,  required: false
      argument :close_time,  String,  required: false
      argument :is_closed_day, Boolean, required: false
      argument :_destroy,    Boolean, required: false
    end
  end
end
