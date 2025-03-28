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
  end
end
