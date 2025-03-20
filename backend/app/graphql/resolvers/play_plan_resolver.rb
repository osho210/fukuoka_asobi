module Resolvers
  class PlayPlanResolver < Resolvers::BaseResolver
    type Types::PlayPlanType, null: true

    argument :id, Integer, required: true

    def resolve(id:)
      # IDはすでに整数なので変換不要
      PlayPlan.find_by(id: id)
    rescue StandardError => e
      Rails.logger.error("PlayPlanResolver error: #{e.message}")
      nil
    end
  end
end
