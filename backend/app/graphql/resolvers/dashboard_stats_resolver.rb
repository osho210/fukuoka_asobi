# frozen_string_literal: true

module Resolvers
  class DashboardStatsResolver < Resolvers::BaseResolver
    type Types::DashboardStatsType, null: false

    def resolve
      {
        spots_count: Spot.count,
        areas_count: Area.count,
        categories_count: Category.count,
        play_plans_count: PlayPlan.count,
        events_count: Event.count,
        news_count: News.count
      }
    end
  end
end
