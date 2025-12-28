# frozen_string_literal: true

module Types
  class WeatherEnumType < Types::BaseEnum
    description "推奨天気"
    value "ANY", value: "any", description: "いつでも"
    value "SUNNY", value: "sunny", description: "晴れ"
    value "CLOUDY", value: "cloudy", description: "曇り"
    value "RAINY", value: "rainy", description: "雨"
    value "SNOWY", value: "snowy", description: "雪"
  end
end
