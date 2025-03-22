module Types
  class CustomOptionsInputType < Types::BaseInputObject
    description "カスタム検索オプションの入力"

    argument :transportation_method, String, required: false, description: "移動手段"
    argument :theme, String, required: false, description: "テーマ"
    argument :rainy_day_option, Boolean, required: false, description: "雨天対応"
    argument :include_events, Boolean, required: false, description: "イベント含む"
    argument :starting_point, String, required: false, description: "出発地点"
    argument :spot_count, Integer, required: false, description: "スポット数"
    argument :categories, [String], required: false, description: "カテゴリー"
  end
end
