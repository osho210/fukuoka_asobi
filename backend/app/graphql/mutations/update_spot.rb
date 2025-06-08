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
    # argument :opening_hours, [Types::OpeningHourInput], required: false

    # argument :opening_hours, [Types::OpeningHourType], required: false
    # argument :opening_hour_list, [Types::OpeningHourListType], required: false, description: "営業時間のリスト（曜日と営業時間）"
    # argument :closed_days, [String], required: false, description: "定休日の曜日リスト"
    # argument :areas, [Types::AreaType], required: false
    # argument :categories, [Types::CategoryType], required: false
    # argument :hashtags, [Types::HashtagType], required: false
    # argument :instagram_embeds, [Types::InstagramEmbedType], required: false
    # argument :menus, [Types::MenuType], required: false
    # argument :spot_ambiances, [Types::SpotAmbianceType], required: false
    # argument :purposes, [Types::PurposeType], required: false


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

      pp 'UpdateSpot resolve called with args: ', update_attrs


      spot = Spot.find_by(id: id)

      # 入力されたフィールドだけで update
      if spot.update!(update_attrs)
        { spot: spot, errors: [] }
      else
        { spot: spot, errors: spot.errors.full_messages }
      end
    end
  end
end
