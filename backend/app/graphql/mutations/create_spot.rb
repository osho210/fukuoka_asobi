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


    field :spot,           Types::SpotType, null: true
    field :errors,         [String],        null: false

    def resolve(input:)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { spot: nil, errors: ["管理者権限が必要です"] }
      end

      spot = Spot.new(input.to_h)

      if spot.save
        { spot: spot, errors: [] }
      else
        { spot: nil, errors: spot.errors.full_messages }
      end
    end
  end
end
