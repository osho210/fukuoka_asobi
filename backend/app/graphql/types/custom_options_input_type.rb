module Types
  class CustomOptionsInputType < Types::BaseInputObject
    description "カスタム検索オプションの入力"

    # 基本オプション
    argument :transportation_method, String, required: false, description: "移動手段"
    argument :theme, String, required: false, description: "テーマ"
    argument :rainy_day_option, Boolean, required: false, description: "雨天対応"
    argument :include_events, Boolean, required: false, description: "イベント含む"
    argument :starting_point, String, required: false, description: "出発地点"
    argument :spot_count, Integer, required: false, description: "スポット数"
    argument :categories, [String], required: false, description: "カテゴリー"

    # プレミアム検索オプション（課金ユーザー専用）
    # 決済手段
    argument :accepts_credit_cards, Boolean, required: false, description: "クレジットカード可（プレミアム）"
    argument :accepts_nfc, Boolean, required: false, description: "NFC決済可（プレミアム）"
    argument :accepts_cash_only, Boolean, required: false, description: "現金のみ（プレミアム）"

    # 飲食店オプション
    argument :serves_breakfast, Boolean, required: false, description: "朝食提供（プレミアム）"
    argument :serves_lunch, Boolean, required: false, description: "ランチ提供（プレミアム）"
    argument :serves_dinner, Boolean, required: false, description: "ディナー提供（プレミアム）"
    argument :serves_vegetarian_food, Boolean, required: false, description: "ベジタリアン対応（プレミアム）"
    argument :outdoor_seating, Boolean, required: false, description: "屋外席あり（プレミアム）"
    argument :good_for_children, Boolean, required: false, description: "子供連れ歓迎（プレミアム）"
    argument :allows_dogs, Boolean, required: false, description: "ペット可（プレミアム）"

    # その他のオプション
    argument :reservable, Boolean, required: false, description: "予約可能（プレミアム）"
    argument :takeout, Boolean, required: false, description: "テイクアウト可（プレミアム）"
    argument :delivery, Boolean, required: false, description: "デリバリー可（プレミアム）"
  end
end
