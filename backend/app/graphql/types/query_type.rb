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

    # 店舗
    field :stores, [Types::StoreType], null: false
    def stores
      Store.all
    end

    field :store, Types::StoreType, null: true do
      argument :id, ID, required: true
    end
    def store(id:)
      Store.find_by(id: id)
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
    field :store_ambiances, [Types::StoreAmbianceType], null: false
    def store_ambiances
      StoreAmbiance.all
    end

    # 遊びのプラン
    field :play_plans, resolver: Resolvers::PlayPlansResolver
    field :play_plan, resolver: Resolvers::PlayPlanResolver
  end
end
