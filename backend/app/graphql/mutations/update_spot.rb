# frozen_string_literal: true

module Mutations
  class UpdateSpot < BaseMutation
    argument :id,                ID,      required: true
    argument :spot_name,         String,  required: false
    argument :address,           String,  required: false
    argument :district_id,       ID,      required: false
    argument :phone_number,      String,  required: false
    argument :website,           String,  required: false
    argument :catchphrase,       String,  required: false
    argument :is_rainy_ok,       Boolean, required: false
    argument :budget_range,      Types::BudgetTypeRangeEnumType,  required: false
    argument :spot_type,         String,  required: false
    argument :theme,             String,  required: false
    argument :review_rating,     Float,   required: false
    argument :review_count,      Int,     required: false
    argument :instagram_url,     String,  required: false
    argument :is_closed,         Boolean, required: false
    argument :min_people,        Int,     required: false
    argument :max_people,        Int,     required: false
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

    argument :opening_hours, [Types::Input::OpeningHourAttributes], required: false,
       as: :opening_hours_attributes

    field :spot,           Types::SpotType, null: true
    field :errors,         [String],        null: false

    def resolve(**args)
      # TODO: リリース前にコメントアウトを解除する
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { spot: nil, errors: ["管理者権限が必要です"] }
      # end

      spot = Spot.find(args[:id])
      update_attrs = args.compact
      update_attrs.delete(:id)

      # Google Places APIからのenum値を小文字に変換
      if update_attrs[:business_status]
        update_attrs[:business_status] = update_attrs[:business_status].downcase
      end
      if update_attrs[:price_level]
        update_attrs[:price_level] = update_attrs[:price_level].downcase
      end

      # 関連IDを分離
      hashtags       = update_attrs.delete(:hashtags)
      purposes       = update_attrs.delete(:purposes)
      spot_ambiances = update_attrs.delete(:spot_ambiances)
      categories     = update_attrs.delete(:categories)
      menus          = update_attrs.delete(:menus)
      areas          = update_attrs.delete(:areas)
      opening_hours_attributes = update_attrs.delete(:opening_hours_attributes)

      ActiveRecord::Base.transaction do
        # 基本情報とネストした属性（営業時間）を更新
        spot.assign_attributes(update_attrs)

        # 中間テーブルの更新 (引数が渡された場合のみ)
        # `args.key?` を使って、引数が明示的に渡されたかを確認する
        spot.hashtags       = Hashtag.where(id: hashtags) if args.key?(:hashtags)
        spot.purposes       = Purpose.where(id: purposes) if args.key?(:purposes)
        spot.spot_ambiances = SpotAmbiance.where(id: spot_ambiances) if args.key?(:spot_ambiances)
        spot.categories     = Category.where(id: categories) if args.key?(:categories)
        spot.menus          = Menu.where(id: menus) if args.key?(:menus)
        spot.areas          = Area.where(id: areas) if args.key?(:areas)

        # 営業時間の処理
        if opening_hours_attributes
          opening_hours_attributes.each do |oh_attrs|
            attrs = oh_attrs.to_h.symbolize_keys
            if attrs[:id].present?
              # 既存レコードを取得
              record = spot.opening_hours.find_by(id: attrs[:id])
              if attrs[:_destroy]
                # _destroy フラグ付きなら削除
                record&.destroy
              else
                # 存在すれば更新
                record&.update!(attrs.except(:id, :_destroy))
              end
            else
              # IDなしは新規作成
              spot.opening_hours.create!(attrs.except(:_destroy))
            end
          end
        end

        # 全ての情報を一度に保存
        spot.save!
      end

      { spot: spot, errors: [] }
    rescue ActiveRecord::RecordNotFound
      { spot: nil, errors: ["Spot not found"] }
    rescue ActiveRecord::RecordInvalid => e
      { spot: nil, errors: e.record.errors.full_messages }
    rescue => e
      { spot: nil, errors: [e.message] }
    end
  end
end
