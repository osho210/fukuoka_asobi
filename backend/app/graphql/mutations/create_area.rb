# app/graphql/mutations/create_area.rb
# frozen_string_literal: true

module Mutations
  class CreateArea < BaseMutation
    # ------------- 修正 -------------
    argument :area_name,   String, required: true
    argument :district_id, ID,     required: true
    # --------------------------------

    field :area,   Types::AreaType, null: true
    field :errors, [String],        null: false

    def resolve(area_name:, district_id:)
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { area: nil, errors: ["管理者権限が必要です"] }
      # end

      area = Area.new(area_name: area_name, district_id: district_id)

      if area.save
        { area: area, errors: [] }
      else
        { area: nil, errors: area.errors.full_messages }
      end
    end
  end
end
