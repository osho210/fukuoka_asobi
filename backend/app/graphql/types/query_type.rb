# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [Types::NodeType, null: true], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ID], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    # カウント系フィールド（個別）
    field :spots_count, Integer, null: false, description: "スポットの総数"
    def spots_count
      Spot.count
    end

    field :areas_count, Integer, null: false, description: "エリアの総数"
    def areas_count
      Area.count
    end

    field :categories_count, Integer, null: false, description: "カテゴリーの総数"
    def categories_count
      Category.count
    end

    field :play_plans_count, Integer, null: false, description: "遊びプランの総数"
    def play_plans_count
      PlayPlan.count
    end

    field :events_count, Integer, null: false, description: "イベントの総数"
    def events_count
      Event.count
    end

    field :news_count, Integer, null: false, description: "ニュースの総数"
    def news_count
      News.count
    end

    # ダッシュボード統計情報（まとめて取得）
    field :dashboard_stats, resolver: Resolvers::DashboardStatsResolver

    # カテゴリー
    field :categories, [Types::CategoryType], null: false
    def categories
      Category.all
    end

    # メニューカテゴリー
    field :menu_categories, [Types::MenuCategoryType], null: false
    def menu_categories
      MenuCategory.all
    end

    # 地区
    field :districts, [Types::DistrictType], null: false
    def districts
      District.all
    end

    field :district, Types::DistrictType, null: true do
      argument :id, ID, required: true
    end
    def district(id:)
      District.find_by(id: id)
    end

    # 地域
    field :areas, [Types::AreaType], null: false
    def areas
      Area.all
    end

    field :area, Types::AreaType, null: true do
      argument :id, ID, required: true
    end
    def area(id:)
      Area.find_by(id: id)
    end

    # スポット
    field :spots, [Types::SpotType], null: false
    def spots
      Spot.all
    end

    field :spot, Types::SpotType, null: true do
      argument :id, ID, required: true
    end
    def spot(id:)
      Spot.find_by(id: id)
    end

    # 雑誌
    field :magazines, [Types::MagazineType], null: false
    def magazines
      Magazine.all
    end

    field :magazine, Types::MagazineType, null: true do
      argument :id, ID, required: true
    end
    def magazine(id:)
      Magazine.find_by(id: id)
    end

    field :stations, [Types::StationType], null: true
    def stations
      Station.all
    end

    # ハッシュタグ
    field :hashtags, [Types::HashtagType], null: false
    def hashtags
      Hashtag.all
    end

    # 目的
    field :purposes, [Types::PurposeType], null: false
    def purposes
      Purpose.all
    end

    # お店の雰囲気
    field :spot_ambiances, [Types::SpotAmbianceType], null: false
    def spot_ambiances
      SpotAmbiance.all
    end

    # 遊びのプラン
    field :play_plans, resolver: Resolvers::PlayPlansResolver
    field :play_plan, resolver: Resolvers::PlayPlanResolver
    field :play_plan_with_details, Types::PlayPlanType, null: true, description: "管理画面用：プラン詳細を含むプラン情報を取得" do
      argument :id, ID, required: true, description: "プランID"
    end
    field :search_plans, resolver: Resolvers::SearchPlansResolver

    def play_plan_with_details(id:)
      PlayPlan
        .includes(
          :recommended_fors,
          plan_details: [:spot, :travel_details]
        )
        .find_by(id: id)
    end

    # イベントカテゴリ
    field :event_categories, [Types::EventCategoryType], null: false
    def event_categories
      EventCategory.all
    end

    field :event_category, Types::EventCategoryType, null: true do
      argument :id, ID, required: true
    end
    def event_category(id:)
      EventCategory.find_by(id: id)
    end

    # イベント
    field :events, resolver: Resolvers::EventsResolver
    field :event, resolver: Resolvers::EventResolver

    # ニュース
    field :news, resolver: Resolvers::NewsResolver
    field :newsDetail, resolver: Resolvers::NewsDetailResolver

    # おすすめ対象
    field :recommended_fors, [Types::RecommendedForType], null: false
    def recommended_fors
      RecommendedFor.all
    end

    field :menus , [Types::MenuType], null: false
    def menus
      Menu.all
    end

    # 選択肢データ
    field :theme_options, resolver: Resolvers::ThemeOptionsResolver
    field :transportation_options, resolver: Resolvers::TransportationOptionsResolver
    field :category_options, resolver: Resolvers::CategoryOptionsResolver

    # プラン生成
    field :generate_plan, resolver: Resolvers::GeneratePlanResolver

    # 現在のユーザー
    field :current_user, resolver: Resolvers::CurrentUserResolver

    # ユーザーの作成したプラン
    field :user_play_plans, resolver: Resolvers::UserPlayPlansResolver

    # ユーザーのブックマーク
    field :user_bookmarks, resolver: Resolvers::UserBookmarksResolver

    # ユーザーのお気に入り
    field :user_favorites, resolver: Resolvers::UserFavoritesResolver

    # プランがお気に入りに登録されているか
    field :is_favorite, resolver: Resolvers::IsFavoriteResolver

    # --------------------------------------------
    # ① Category 単体取得
    # --------------------------------------------
    field :category, Types::CategoryType, null: true do
      argument :id, ID, required: true
    end
    def category(id:)
      Category.find_by(id: id)
    end

    # --------------------------------------------
    # ② Hashtag 単体取得
    # --------------------------------------------
    field :hashtag, Types::HashtagType, null: true do
      argument :id, ID, required: true
    end
    def hashtag(id:)
      Hashtag.find_by(id: id)
    end

    # --------------------------------------------
    # ③ Purpose 単体取得
    # --------------------------------------------
    field :purpose, Types::PurposeType, null: true do
      argument :id, ID, required: true
    end
    def purpose(id:)
      Purpose.find_by(id: id)
    end

    # --------------------------------------------
    # ④ RecommendedFor 単体取得
    # --------------------------------------------
    field :recommended_for, Types::RecommendedForType, null: true do
      argument :id, ID, required: true
    end
    def recommended_for(id:)
      RecommendedFor.find_by(id: id)
    end

    # --------------------------------------------
    # ⑤ SpotAmbiance 単体取得
    # --------------------------------------------
    field :spot_ambiance, Types::SpotAmbianceType, null: true do
      argument :id, ID, required: true
    end
    def spot_ambiance(id:)
      SpotAmbiance.find_by(id: id)
    end

    # --------------------------------------------
    # Google Places API関連
    # --------------------------------------------
    field :search_google_places, [Types::GooglePlaceType], null: false, description: "Google Places APIでスポットを検索する" do
      argument :query, String, required: true, description: "検索クエリ"
      argument :latitude, Float, required: false, description: "検索中心の緯度"
      argument :longitude, Float, required: false, description: "検索中心の経度"
      argument :radius, Integer, required: false, description: "検索半径（メートル）"
    end

    def search_google_places(query:, latitude: nil, longitude: nil, radius: nil)
      places_service = GooglePlacesService.new

      location = nil
      if latitude && longitude
        location = { lat: latitude, lng: longitude }
      end

      search_results = places_service.search_places(query, location: location, radius: radius)

      if search_results.key?('error')
        raise GraphQL::ExecutionError, "Google Places API Error: #{search_results['error']}"
      end

      places = search_results['places'] || []


      places.map do |place|
        # 各場所の詳細情報を取得して生成概要を取得
        {
          place_id: place['id'],
          name: place.dig('displayName', 'text'),
          formatted_address: place['formattedAddress'],
          short_formatted_address: place['shortFormattedAddress'],
          location: place['location'],
          google_maps_uri: place['googleMapsUri'],
          website_uri: place['websiteUri'],
          national_phone_number: place['nationalPhoneNumber'],
          international_phone_number: place['internationalPhoneNumber'],
          rating: place['rating'],
          user_rating_count: place['userRatingCount'],
          review_summary: place['reviewSummary'],
          types: place['types'],
          primary_type: place['primaryType'],
          primary_type_display_name: place.dig('primaryTypeDisplayName', 'text'),
          business_status: place['businessStatus'],
          regular_opening_hours: place['regularOpeningHours'],
          current_opening_hours: place['currentOpeningHours'],
          regular_secondary_opening_hours: place['regularSecondaryOpeningHours'],
          current_secondary_opening_hours: place['currentSecondaryOpeningHours'],
          time_zone: place['timeZone'],
          utc_offset_minutes: place['utcOffsetMinutes'],
          price_level: place['priceLevel'],
          price_range: place['priceRange'],
          photos: place['photos'],
          icon_mask_base_uri: place['iconMaskBaseUri'],
          icon_background_color: place['iconBackgroundColor'],
          payment_options: place['paymentOptions'],
          parking_options: place['parkingOptions'],
          accessibility_options: place['accessibilityOptions'],
          generative_summary: place.dig('generativeSummary', 'text'),
          editorial_summary: place.dig('editorialSummary', 'text'),
          takeout: place['takeout'],
          delivery: place['delivery'],
          dine_in: place['dineIn'],
          curbside_pickup: place['curbsidePickup'],
          reservable: place['reservable'],
          serves_breakfast: place['servesBreakfast'],
          serves_lunch: place['servesLunch'],
          serves_dinner: place['servesDinner'],
          serves_brunch: place['servesBrunch'],
          serves_beer: place['servesBeer'],
          serves_wine: place['servesWine'],
          serves_vegetarian_food: place['servesVegetarianFood'],
          serves_cocktails: place['servesCocktails'],
          serves_dessert: place['servesDessert'],
          serves_coffee: place['servesCoffee'],
          outdoor_seating: place['outdoorSeating'],
          live_music: place['liveMusic'],
          menu_for_children: place['menuForChildren'],
          good_for_children: place['goodForChildren'],
          allows_dogs: place['allowsDogs'],
          restroom: place['restroom'],
          good_for_groups: place['goodForGroups'],
          good_for_watching_sports: place['goodForWatchingSports']
        }
      end
    rescue => e
      Rails.logger.error "Google Places search error: #{e.message}"
      raise GraphQL::ExecutionError, "検索中にエラーが発生しました: #{e.message}"
    end

    # --------------------------------------------
    # HeartRails Express API関連
    # --------------------------------------------
    field :nearest_station, String, null: true, description: "指定された緯度・経度から最寄駅を取得します。" do
      argument :latitude, Float, required: true, description: "緯度"
      argument :longitude, Float, required: true, description: "経度"
    end

    def nearest_station(latitude:, longitude:)
      station_service = HeartRails::StationService.new(latitude, longitude)
      station_service.fetch_nearest_station
    rescue => e
      Rails.logger.error "HeartRails Station search error: #{e.message}"
      raise GraphQL::ExecutionError, "最寄駅の取得中にエラーが発生しました: #{e.message}"
    end

    # --------------------------------------------
    # グループ体験機能
    # --------------------------------------------
    field :direction_cards, [Types::DirectionCardType], null: false, description: "方向性カードをランダムに取得します" do
      argument :limit, Integer, required: false, default_value: 3, description: "取得件数（デフォルト3）"
    end

    def direction_cards(limit:)
      DirectionCard.weighted_random(limit)
    end

    field :direction_card, Types::DirectionCardType, null: true, description: "指定IDの方向性カードを取得します" do
      argument :id, ID, required: true, description: "方向性カードID"
    end

    def direction_card(id:)
      DirectionCard.find_by(id: id)
    end

    field :all_direction_cards, [Types::DirectionCardType], null: false, description: "すべての方向性カードを取得します（管理画面用）"

    def all_direction_cards
      DirectionCard.order(created_at: :desc)
    end

    field :experience_cards, [Types::ExperienceCardType], null: false, description: "タグに基づいて体験カードを取得します" do
      argument :tags, [String], required: false, description: "フィルタリングするタグの配列"
      argument :limit, Integer, required: false, default_value: 5, description: "取得件数（デフォルト5）"
      argument :exclude_ids, [ID], required: false, description: "除外するカードID"
    end

    def experience_cards(tags: nil, limit: 5, exclude_ids: nil)
      cards = if tags.present?
                ExperienceCard.order_by_tag_matches(tags)
              else
                ExperienceCard.active.order(Arel.sql('RAND()'))
              end

      cards = cards.where.not(id: exclude_ids) if exclude_ids.present?
      cards.limit(limit)
    end

    field :experience_card, Types::ExperienceCardType, null: true, description: "指定IDの体験カードを取得します" do
      argument :id, ID, required: true, description: "体験カードID"
    end

    def experience_card(id:)
      ExperienceCard.find_by(id: id)
    end

    field :all_experience_cards, [Types::ExperienceCardType], null: false, description: "すべての体験カードを取得します（管理画面用）"

    def all_experience_cards
      ExperienceCard.order(created_at: :desc)
    end

    # レイアウトバケット
    # --------------------------------------------
    field :layout_buckets, [Types::LayoutBucketType], null: false, description: "レイアウトバケット一覧を取得" do
      argument :limit, Integer, required: false, description: "取得件数"
      argument :offset, Integer, required: false, description: "オフセット"
      argument :sort_field, String, required: false, description: "ソートフィールド"
      argument :sort_direction, String, required: false, description: "ソート方向（asc/desc）"
    end
    def layout_buckets(limit: nil, offset: nil, sort_field: nil, sort_direction: nil)
      query = LayoutBucket.all
      query = query.order("#{sort_field} #{sort_direction}") if sort_field && sort_direction
      query = query.limit(limit) if limit
      query = query.offset(offset) if offset
      query
    end

    field :layout_bucket, Types::LayoutBucketType, null: true, description: "レイアウトバケット詳細を取得" do
      argument :id, ID, required: true, description: "レイアウトバケットID"
    end
    def layout_bucket(id:)
      LayoutBucket.find_by(id: id)
    end

    # --------------------------------------------
    # バケットリスト企画
    # --------------------------------------------
    field :bucket_list_items, [Types::BucketListItemType], null: false, description: "バケットリスト企画一覧を取得" do
      argument :limit, Integer, required: false, description: "取得件数"
      argument :offset, Integer, required: false, description: "オフセット"
      argument :sort_field, String, required: false, description: "ソートフィールド"
      argument :sort_direction, String, required: false, description: "ソート方向（asc/desc）"
      argument :status, String, required: false, description: "ステータスフィルタ"
      argument :weather, String, required: false, description: "天気フィルタ"
    end
    def bucket_list_items(limit: nil, offset: nil, sort_field: nil, sort_direction: nil, status: nil, weather: nil)
      query = BucketListItem.includes(:layout_bucket, :bucket_list_item_belongings, :bucket_list_item_references)
      query = query.where(status: status) if status.present?
      query = query.where(weather: weather) if weather.present?
      query = query.order("#{sort_field} #{sort_direction}") if sort_field && sort_direction
      query = query.limit(limit) if limit
      query = query.offset(offset) if offset
      query
    end

    field :bucket_list_item, Types::BucketListItemType, null: true, description: "バケットリスト企画詳細を取得" do
      argument :id, ID, required: true, description: "バケットリスト企画ID"
    end
    def bucket_list_item(id:)
      BucketListItem.includes(:layout_bucket, :bucket_list_item_belongings, :bucket_list_item_references).find_by(id: id)
    end
  end
end
