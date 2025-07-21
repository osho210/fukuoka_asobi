# app/graphql/mutations/create_spot.rb
# frozen_string_literal: true

module Mutations
  class CreateSpot < BaseMutation
    argument :spot_name,         String,  required: true
    argument :address,           String,  required: true
    argument :district_id,       ID,      required: true
    argument :phone_number,      String,  required: false
    argument :website,           String,  required: false
    argument :catchphrase,       String,  required: false
    argument :is_rainy_ok,       Boolean, required: false
    argument :budget_range,      Types::BudgetTypeRangeEnumType,  required: false
    argument :spot_type,         String,  required: true
    argument :theme,             String,  required: false
    argument :review_rating,     Float,   required: false
    argument :review_count,      Int,     required: false
    argument :instagram_url,     String,  required: false
    argument :is_closed,         Boolean, required: false
    argument :max_people,        Int,     required: false
    argument :min_people,        Int,     required: false
    argument :recommended_for_1, String,  required: false
    argument :recommended_for_2, String,  required: false
    argument :image_url, String,          required: false
    argument :nearest_station, String,    required: false
    argument :parking_available, Boolean, required: false

    # Google Places API関連フィールド
    argument :google_place_id,          String,  required: false
    argument :latitude,                 Float,   required: false
    argument :longitude,                Float,   required: false
    argument :business_status,          String,  required: false
    argument :price_level,              String,  required: false
    argument :primary_type,             String,  required: false
    argument :primary_type_display_name, String,  required: false
    argument :international_phone_number, String,  required: false
    argument :short_formatted_address,  String,  required: false
    argument :google_maps_uri,          String,  required: false
    argument :time_zone_id,             String,  required: false
    argument :google_types,             [String], required: false
    argument :generative_summary,       String,  required: false
    argument :editorial_summary,        String,  required: false
    argument :price_range_start_amount, Float,   required: false
    argument :price_range_end_amount,   Float,   required: false
    argument :review_summary_text,      String,  required: false
    argument :review_summary_flag_content_uri, String, required: false
    argument :review_summary_disclosure_text, String, required: false
    argument :review_summary_reviews_uri, String, required: false
    argument :pure_service_area_business, Boolean, required: false

    # サービス提供情報
    argument :takeout,                  Boolean, required: false
    argument :delivery,                 Boolean, required: false
    argument :dine_in,                  Boolean, required: false
    argument :reservable,               Boolean, required: false
    argument :serves_breakfast,         Boolean, required: false
    argument :serves_lunch,             Boolean, required: false
    argument :serves_dinner,            Boolean, required: false
    argument :serves_brunch,            Boolean, required: false
    argument :serves_beer,              Boolean, required: false
    argument :serves_wine,              Boolean, required: false
    argument :serves_vegetarian_food,   Boolean, required: false
    argument :outdoor_seating,          Boolean, required: false
    argument :live_music,               Boolean, required: false
    argument :menu_for_children,        Boolean, required: false
    argument :serves_cocktails,         Boolean, required: false
    argument :serves_dessert,           Boolean, required: false
    argument :serves_coffee,            Boolean, required: false
    argument :good_for_children,        Boolean, required: false
    argument :allows_dogs,              Boolean, required: false
    argument :restroom,                 Boolean, required: false
    argument :good_for_groups,          Boolean, required: false
    argument :good_for_watching_sports, Boolean, required: false

    # Payment Options
    argument :accepts_credit_cards,     Boolean, required: false
    argument :accepts_debit_cards,      Boolean, required: false
    argument :accepts_cash_only,        Boolean, required: false
    argument :accepts_nfc,              Boolean, required: false

    # Parking Options
    argument :free_parking_lot,         Boolean, required: false
    argument :paid_parking_lot,         Boolean, required: false
    argument :free_street_parking,      Boolean, required: false
    argument :paid_street_parking,      Boolean, required: false
    argument :valet_parking,            Boolean, required: false
    argument :free_garage_parking,      Boolean, required: false
    argument :paid_garage_parking,      Boolean, required: false

    # 関連項目の引数を追加
    argument :hashtags,                 [ID], required: false
    argument :purposes,                 [ID], required: false
    argument :spot_ambiances,           [ID], required: false
    argument :categories,               [ID], required: false
    argument :menus,                    [ID], required: false
    argument :areas,                    [ID], required: false

    # 営業時間
    argument :opening_hours_attributes, [Types::Input::OpeningHourAttributes], required: false

    # 雑誌掲載情報
    argument :spot_magazines_attributes, [Types::Input::SpotMagazineAttributes], required: false

    field :spot,           Types::SpotType, null: true
    field :errors,         [String],        null: false

    def resolve(**args)
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { spot: nil, errors: ["管理者権限が必要です"] }
      # end

      input = args.compact

      # すべての値を半角に変換（文字列のみ）
      input.each do |k, v|
        if v.is_a?(String)
          input[k] = v.unicode_normalize(:nfkc)
        elsif v.is_a?(Array)
          input[k] = v.map { |e| e.is_a?(String) ? e.unicode_normalize(:nfkc) : e }
        end
      end

      # Google Places APIからのenum値を小文字に変換
      if input[:business_status]
        input[:business_status] = input[:business_status].downcase
      end
      if input[:price_level]
        input[:price_level] = input[:price_level].downcase.gsub('price_level_', '')
      end


      # 基本情報から連携項目を分離
      hashtags       = input.delete(:hashtags)
      purposes       = input.delete(:purposes)
      spot_ambiances = input.delete(:spot_ambiances)
      categories     = input.delete(:categories)
      menus          = input.delete(:menus)
      areas          = input.delete(:areas)

      # spot_magazines_attributes をハッシュの配列に変換
      if input[:spot_magazines_attributes]
        input[:spot_magazines_attributes] = input[:spot_magazines_attributes].map(&:to_h)
      end

      spot = Spot.new(input)

      ActiveRecord::Base.transaction do
        # 関連オブジェクトを割り当て
        spot.hashtags       = Hashtag.where(id: hashtags) if hashtags
        spot.purposes       = Purpose.where(id: purposes) if purposes
        spot.spot_ambiances = SpotAmbiance.where(id: spot_ambiances) if spot_ambiances
        spot.categories     = Category.where(id: categories) if categories
        spot.menus          = Menu.where(id: menus) if menus
        spot.areas          = Area.where(id: areas) if areas

        # 全ての情報を一度に保存
        spot.save!
      end

      { spot: spot.reload, errors: [] }
    rescue ActiveRecord::RecordInvalid => e
      # バリデーションエラーが発生した場合、エラーメッセージを返す
      { spot: nil, errors: e.record.errors.full_messages }
    rescue => e
      # その他の予期せぬエラー
      { spot: nil, errors: [e.message] }
    end
  end
end
