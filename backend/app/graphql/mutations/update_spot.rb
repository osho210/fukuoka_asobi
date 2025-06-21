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
    # argument :opening_hours, [Types::OpeningHourInput], required: false

    # 関連項目の引数を追加
    argument :hashtags,       [ID], required: false
    argument :purposes,       [ID], required: false
    argument :spot_ambiances, [ID], required: false
    argument :categories,      [ID], required: false   # typo してた categorie_ids → category_ids
    argument :menus,         [ID], required: false
    argument :areas,         [ID], required: false

    field :spot,           Types::SpotType, null: false
    field :errors,         [String],        null: false


    def resolve(**args)
      # TODO: リリース前にコメントアウトを解除する
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { spot: nil, errors: ["管理者権限が必要です"] }
      # end

      id           = args.delete(:id)
      update_attrs = args.compact       # nil を除外

      # 基本情報から連携項目を分離
      hashtags       = update_attrs.delete(:hashtags)
      purposes       = update_attrs.delete(:purposes)
      spot_ambiances = update_attrs.delete(:spot_ambiances)
      categories     = update_attrs.delete(:categories)
      menus          = update_attrs.delete(:menus)
      areas          = update_attrs.delete(:areas)

      spot = Spot.find_by(id: id)

      ActiveRecord::Base.transaction do
        # 基本情報の更新
        spot.update!(update_attrs)

        # 中間テーブルの更新
        spot.hashtags       = Hashtag.where(id: hashtags) if hashtags
        spot.purposes       = Purpose.where(id: purposes) if purposes
        spot.spot_ambiances = SpotAmbiance.where(id: spot_ambiances) if spot_ambiances
        spot.categories     = Category.where(id: categories) if categories
        spot.menus          = Menu.where(id: menus) if menus
        spot.areas          = Area.where(id: areas) if areas
      end

      { spot: spot, errors: [] }
    rescue => e
      { spot: nil, errors: [e.message] }
    end
  end
end
