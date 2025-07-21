module Types
  class GooglePlaceType < Types::BaseObject
    description "Google Places APIから取得したスポット情報"

    # 基本情報
    field :place_id, String, null: false, description: "Google Place ID"
    field :name, String, null: true, description: "スポット名"
    field :formatted_address, String, null: true, description: "フォーマットされた住所"
    field :short_formatted_address, String, null: true, description: "短縮住所"
    field :location, Types::LocationType, null: true, description: "位置情報"
    field :google_maps_uri, String, null: true, description: "Google Maps URI"
    field :website_uri, String, null: true, description: "ウェブサイトURI"
    field :national_phone_number, String, null: true, description: "国内電話番号"
    field :international_phone_number, String, null: true, description: "国際電話番号"

    # 評価・レビュー
    field :rating, Float, null: true, description: "評価"
    field :user_rating_count, Integer, null: true, description: "レビュー数"
    field :review_summary, Types::ReviewSummaryType, null: true, description: "レビュー概要"

    # カテゴリ・タイプ
    field :types, [String], null: true, description: "スポットタイプ一覧"
    field :primary_type, String, null: true, description: "メインタイプ"
    field :primary_type_display_name, String, null: true, description: "メインタイプ表示名"

    # 営業情報
    field :business_status, String, null: true, description: "営業ステータス"
    field :regular_opening_hours, Types::OpeningHourListType, null: true, description: "通常の営業時間"
    field :current_opening_hours, Types::OpeningHourListType, null: true, description: "現在の営業時間"
    field :regular_secondary_opening_hours, [Types::OpeningHourListType], null: true, description: "第二の通常の営業時間"
    field :current_secondary_opening_hours, [Types::OpeningHourListType], null: true, description: "第二の現在の営業時間"
    field :time_zone, String, null: true, description: "タイムゾーン"
    field :utc_offset_minutes, Integer, null: true, description: "UTCオフセット（分）"

    # 価格情報
    field :price_level, String, null: true, description: "価格レベル"
    field :price_range, Types::PriceRangeType, null: true, description: "価格帯"

    # 写真・アイコン
    field :photos, [Types::SpotPhotoType], null: true, description: "写真"
    field :icon_mask_base_uri, String, null: true, description: "アイコンマスクURI"
    field :icon_background_color, String, null: true, description: "アイコン背景色"

    # 支払い・駐車場・バリアフリー
    field :payment_options, Types::PaymentOptionsType, null: true, description: "支払いオプション"
    field :parking_options, Types::ParkingOptionsType, null: true, description: "駐車場オプション"
    field :accessibility_options, Types::AccessibilityOptionType, null: true, description: "バリアフリーオプション"

    # 概要
    field :generative_summary, String, null: true, description: "生成AIによる概要"
    field :editorial_summary, String, null: true, description: "編集者による概要"

    # 提供サービス (Boolean)
    field :takeout, Boolean, null: true, description: "テイクアウト可能か"
    field :delivery, Boolean, null: true, description: "デリバリー可能か"
    field :dine_in, Boolean, null: true, description: "店内飲食可能か"
    field :curbside_pickup, Boolean, null: true, description: "駐車場受け取り可能か"
    field :reservable, Boolean, null: true, description: "予約可能か"
    field :serves_breakfast, Boolean, null: true, description: "朝食を提供しているか"
    field :serves_lunch, Boolean, null: true, description: "ランチを提供しているか"
    field :serves_dinner, Boolean, null: true, description: "ディナーを提供しているか"
    field :serves_brunch, Boolean, null: true, description: "ブランチを提供しているか"
    field :serves_beer, Boolean, null: true, description: "ビールを提供しているか"
    field :serves_wine, Boolean, null: true, description: "ワインを提供しているか"
    field :serves_vegetarian_food, Boolean, null: true, description: "ベジタリアンフードを提供しているか"
    field :serves_cocktails, Boolean, null: true, description: "カクテルを提供しているか"
    field :serves_dessert, Boolean, null: true, description: "デザートを提供しているか"
    field :serves_coffee, Boolean, null: true, description: "コーヒーを提供しているか"

    # 設備・その他 (Boolean)
    field :outdoor_seating, Boolean, null: true, description: "屋外席があるか"
    field :live_music, Boolean, null: true, description: "ライブミュージックがあるか"
    field :menu_for_children, Boolean, null: true, description: "子供向けメニューがあるか"
    field :good_for_children, Boolean, null: true, description: "子供連れに適しているか"
    field :allows_dogs, Boolean, null: true, description: "犬の同伴が可能か"
    field :restroom, Boolean, null: true, description: "トイレがあるか"
    field :good_for_groups, Boolean, null: true, description: "グループ利用に適しているか"
    field :good_for_watching_sports, Boolean, null: true, description: "スポーツ観戦に適しているか"
  end
end
