# frozen_string_literal: true

module Types
  class DashboardStatsType < Types::BaseObject
    field :spots_count, Integer, null: false, description: "スポットの総数"
    field :areas_count, Integer, null: false, description: "エリアの総数"
    field :categories_count, Integer, null: false, description: "カテゴリーの総数"
    field :play_plans_count, Integer, null: false, description: "遊びプランの総数"
    field :events_count, Integer, null: false, description: "イベントの総数"
    field :news_count, Integer, null: false, description: "ニュースの総数"
  end
end
