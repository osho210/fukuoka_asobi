module Resolvers
  class EventResolver < Resolvers::BaseResolver
    type Types::EventType, null: true

    argument :id, ID, required: true

    def resolve(id:)
      Event.find_by(id: id)
    end
  end
end
