# frozen_string_literal: true

module Types
  class SpotType < Types::BaseObject
    field :id, ID, null: false
    field :district_id, Integer, null: false
    field :spot_name, String, null: false
    field :description, String, null: true
    field :address, String, null: true
    field :phone_number, String, null: true
    field :website, String, null: true
    field :catchphrase, String, null: true
    field :recommended_for_1, String, null: true
    field :recommended_for_2, String, null: true
    field :parking_available, Boolean, null: false
    field :nearest_station, String, null: true
    field :review_rating, Float, null: true
    field :review_count, Integer, null: true
    field :instagram_url, String, null: true
    field :is_closed, Boolean, null: false
    field :budget_range, Types::BudgetTypeRangeEnumType, null: false
    field :max_people, Integer, null: true
    field :min_people, Integer, null: false
    field :is_rainy_ok, Boolean, null: false
    field :theme, String, null: true
    field :image_url, Types::ImageType, null: true

    def image_url
      return nil unless object.images.attached?

      first_image = object.images.first
      {
        id: first_image.id,
        url: convert_storage_url(first_image.url)
      }
    end

    field :google_place_id, String, null: true
    field :latitude,        Float,  null: false
    field :longitude,       Float,  null: false
    field :business_status, Types::BusinessStatusEnumType, null: true
    field :price_level,     Types::PriceLevelEnumType, null: true
    field :last_api_sync_at, GraphQL::Types::ISO8601DateTime, null: true
    field :api_sync_status, String, null: true
    field :spot_type, Types::SpotTypeEnumType, null: false
    field :is_public, Boolean, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :image_urls, [Types::ImageType], null: true, description: "スポットに紐づく画像のURLリスト"

    field :district, Types::DistrictType, null: false
    field :opening_hours, [Types::OpeningHourType], null: false
    field :opening_hour_list, [Types::OpeningHourListType], null: false, description: "営業時間のリスト（曜日と営業時間）"
    field :closed_days, [String], null: false, description: "定休日の曜日リスト"
    field :areas, [Types::AreaType], null: false
    field :categories, [Types::CategoryType], null: false
    field :hashtags, [Types::HashtagType], null: false
    field :instagram_embeds, [Types::InstagramEmbedType], null: false
    field :menus, [Types::MenuType], null: false
    field :spot_ambiances, [Types::SpotAmbianceType], null: false
    field :purposes, [Types::PurposeType], null: false
    field :magazines, [Types::MagazineType], null: true, description: '掲載雑誌リスト'
    field :spot_magazines, [Types::SpotMagazineType], null: true, description: '掲載雑誌の中間テーブル情報'

    # Google Places API関連フィールド
    field :google_types, [String], null: true
    field :primary_type, String, null: true
    field :primary_type_display_name, String, null: true
    field :international_phone_number, String, null: true
    field :short_formatted_address, String, null: true
    field :adr_format_address, String, null: true
    field :google_maps_uri, String, null: true
    field :icon_mask_base_uri, String, null: true
    field :icon_background_color, String, null: true
    field :time_zone_id, String, null: true
    field :time_zone_display_name, String, null: true
    field :utc_offset_minutes, Integer, null: true
    field :generative_summary, String, null: true
    field :editorial_summary, String, null: true

    # Google Places API関連の複合型
    field :price_range, Types::PriceRangeType, null: true
    field :review_summary, Types::ReviewSummaryType, null: true
    field :payment_options, Types::PaymentOptionsType, null: true
    field :accepts_credit_cards, Boolean, null: true
    field :accepts_debit_cards, Boolean, null: true
    field :accepts_cash_only, Boolean, null: true
    field :accepts_nfc, Boolean, null: true
    field :parking_options, Types::ParkingOptionsType, null: true
    field :free_parking_lot, Boolean, null: true
    field :paid_parking_lot, Boolean, null: true
    field :free_street_parking, Boolean, null: true
    field :paid_street_parking, Boolean, null: true
    field :valet_parking, Boolean, null: true
    field :free_garage_parking, Boolean, null: true
    field :paid_garage_parking, Boolean, null: true
    field :price_range_start_amount, Float, null: true
    field :price_range_end_amount, Float, null: true
    field :price_range_average, Float, null: true, description: "価格帯の平均値"
    field :spot_photos, [Types::SpotPhotoType], null: true
    field :accessibility_options, [Types::AccessibilityOptionType], null: true

    # サービス提供情報
    field :takeout, Boolean, null: false
    field :delivery, Boolean, null: false
    field :dine_in, Boolean, null: false
    field :curbside_pickup, Boolean, null: false
    field :reservable, Boolean, null: false
    field :serves_breakfast, Boolean, null: false
    field :serves_lunch, Boolean, null: false
    field :serves_dinner, Boolean, null: false
    field :serves_brunch, Boolean, null: false
    field :serves_beer, Boolean, null: false
    field :serves_wine, Boolean, null: false
    field :serves_vegetarian_food, Boolean, null: false
    field :outdoor_seating, Boolean, null: false
    field :live_music, Boolean, null: false
    field :menu_for_children, Boolean, null: false
    field :serves_cocktails, Boolean, null: false
    field :serves_dessert, Boolean, null: false
    field :serves_coffee, Boolean, null: false
    field :good_for_children, Boolean, null: false
    field :allows_dogs, Boolean, null: false
    field :restroom, Boolean, null: false
    field :good_for_groups, Boolean, null: false
    field :good_for_watching_sports, Boolean, null: false
    field :pure_service_area_business, Boolean, null: false

    def opening_hour_list
      object.opening_hour_list
    end


    def closed_days
      object.closed_days
    end

    def google_types
      object.google_types_array
    end

    def price_range
      object.price_range
    end

    def review_summary
      object.review_summary
    end

    def payment_options
      object.payment_options
    end

    def accepts_credit_cards
      object.payment_options&.[]('accepts_credit_cards')
    end

    def accepts_debit_cards
      object.payment_options&.[]('accepts_debit_cards')
    end

    def accepts_cash_only
      object.payment_options&.[]('accepts_cash_only')
    end

    def accepts_nfc
      object.payment_options&.[]('accepts_nfc')
    end

    def parking_options
      object.parking_options
    end

    def free_parking_lot
      object.parking_options&.[]('free_parking_lot')
    end

    def paid_parking_lot
      object.parking_options&.[]('paid_parking_lot')
    end

    def free_street_parking
      object.parking_options&.[]('free_street_parking')
    end

    def paid_street_parking
      object.parking_options&.[]('paid_street_parking')
    end

    def valet_parking
      object.parking_options&.[]('valet_parking')
    end

    def free_garage_parking
      object.parking_options&.[]('free_garage_parking')
    end

    def paid_garage_parking
      object.parking_options&.[]('paid_garage_parking')
    end

    def spot_photos
      object.spot_photos
    end

    def accessibility_options
      object.accessibility_options
    end

    # 価格帯の平均値を計算するメソッド
    def price_range_average
      start_amount = object.price_range_start_amount
      end_amount = object.price_range_end_amount

      # 値が両方とも値が存在する場合は平均値を計算
      # 厳密な予算が知りたいわけではないので、10の位は四捨五入 ¥765 → ¥800
      return ((start_amount + end_amount) / 2.0).round(-2) if start_amount.present? && end_amount.present?

      # 片方がnilの場合はもう一方の値を返す
      start_amount.present? ? start_amount : end_amount
    end

    def image_urls
      object.images.map do |image|
        {
          id: image.id,
          url: convert_storage_url(image.url)
        }
      end
    end
  end
end
