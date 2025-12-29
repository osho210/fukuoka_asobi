# frozen_string_literal: true

module Types
  class WeatherEnumType < Types::BaseEnum
    description "推奨天気"
    value "any", value: "any", description: "いつでも"
    value "sunny", value: "sunny", description: "晴れ"
    value "cloudy", value: "cloudy", description: "曇り"
    value "rainy", value: "rainy", description: "雨"
    value "snowy", value: "snowy", description: "雪"
  end
end
