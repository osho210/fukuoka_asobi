module Types
  class StoreType < Types::BaseObject
    field :id, ID, null: false
    field :district_id, Integer, null: false
    field :store_name, String, null: false
    field :address, String, null: true
    field :phone_number, String, null: true
    field :website, String, null: true
    field :catchphrase, String, null: true
    field :recommended_for_1, String, null: true
    field :recommended_for_2, String, null: true
    field :parking_available, Boolean, null: true
    field :nearest_station, String, null: true
    field :review_rating, Float, null: true
    field :review_count, Integer, null: true
    field :instagram_url, String, null: true
    field :is_closed, Boolean, null: true
    field :budget_range, String, null: true
    field :max_people, Integer, null: true
    field :min_people, Integer, null: true
    field :is_rainy_ok, Boolean, null: true
    field :theme, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    field :district, Types::DistrictType, null: false
    field :opening_hours, [Types::OpeningHourType], null: false
    field :areas, [Types::AreaType], null: false
    field :categories, [Types::CategoryType], null: false
    field :hashtags, [Types::HashtagType], null: false
    field :instagram_embeds, [Types::InstagramEmbedType], null: false
    field :menus, [Types::MenuType], null: false
    field :store_ambiances, [Types::StoreAmbianceType], null: false
    field :purposes, [Types::PurposeType], null: false
  end
end
