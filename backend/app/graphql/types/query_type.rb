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
    field :search_plans, resolver: Resolvers::SearchPlansResolver

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
    field :news_detail, resolver: Resolvers::NewsDetailResolver

    # おすすめ対象
    field :recommended_fors, [Types::RecommendedForType], null: false
    def recommended_fors
      RecommendedFor.all
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
  end
end
