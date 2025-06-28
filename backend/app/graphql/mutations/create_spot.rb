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
    argument :budget_range,      String,  required: false
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
    # TODO: ここも中間テーブルの回収が必要
    # argument :instagram_embeds, String,  required: false

    # 関連項目の引数を追加
    argument :hashtags,       [ID], required: false
    argument :purposes,       [ID], required: false
    argument :spot_ambiances, [ID], required: false
    argument :categories,     [ID], required: false
    argument :menus,          [ID], required: false
    argument :areas,          [ID], required: false

    field :spot,           Types::SpotType, null: true
    field :errors,         [String],        null: false

    def resolve(**args)
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { spot: nil, errors: ["管理者権限が必要です"] }
      # end

      input = args.compact

      # 基本情報から連携項目を分離
      hashtags       = input.delete(:hashtags)
      purposes       = input.delete(:purposes)
      spot_ambiances = input.delete(:spot_ambiances)
      categories     = input.delete(:categories)
      menus          = input.delete(:menus)
      areas          = input.delete(:areas)

      spot = Spot.new(input)

      if spot.save
        { spot: spot, errors: [] }
      else
        { spot: nil, errors: spot.errors.full_messages }
      end
    end
  end
end
