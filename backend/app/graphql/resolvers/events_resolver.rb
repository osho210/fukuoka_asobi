# frozen_string_literal: true

module Resolvers
  class EventsResolver < BaseResolver
    type [Types::EventType], null: false

    argument :limit, Integer, required: false
    argument :upcoming, Boolean, required: false

    def resolve(limit: nil, upcoming: nil)
      scope = Event.all
      scope = scope.where('start_datetime >= ?', Time.current) if upcoming
      scope = scope.limit(limit) if limit.present?
      scope.order(start_datetime: :asc)
    end
  end
end
