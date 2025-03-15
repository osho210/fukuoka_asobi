module Resolvers
  class PlayPlanResolver < Resolvers::BaseResolver
    type Types::PlayPlanType, null: true

    argument :id, ID, required: true

    def resolve(id:)
      PlayPlan.find_by(id: id)
    end
  end
end
