module Resolvers
  class PlayPlanResolver < Resolvers::BaseResolver
    type Types::PlayPlanType, null: true

    argument :id, ID, required: true

    def resolve(id:)
      # IDを整数に変換して検索
      PlayPlan.find_by(id: id.to_i)
    rescue StandardError => e
      Rails.logger.error("PlayPlanResolver error: #{e.message}")
      nil
    end
  end
end
