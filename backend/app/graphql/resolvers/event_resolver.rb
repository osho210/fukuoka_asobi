# frozen_string_literal: true

module Resolvers
  class EventResolver < BaseResolver
    type Types::EventType, null: true

    argument :id, ID, required: true

    def resolve(id:)
      Event.find_by(id: id)
    end
  end
end
