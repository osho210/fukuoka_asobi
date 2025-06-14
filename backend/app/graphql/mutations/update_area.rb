# app/graphql/mutations/update_area.rb
# frozen_string_literal: true

module Mutations
  class UpdateArea < BaseMutation
    # ----------- 修正 -----------
    argument :id,           ID,     required: true
    argument :area_name,    String, required: false
    argument :district_id,  ID,     required: false
    # ----------------------------

    field :area,   Types::AreaType, null: true
    field :errors, [String],        null: false

    def resolve(id:, area_name: nil, district_id: nil)
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { area: nil, errors: ["管理者権限が必要です"] }
      # end

      area = Area.find_by(id: id)
      return { area: nil, errors: ["指定されたエリアが見つかりません"] } unless area

      attrs = {}
      attrs[:area_name]   = area_name   if area_name.present?
      attrs[:district_id] = district_id if district_id.present?

      if area.update(attrs)
        { area: area, errors: [] }
      else
        { area: nil, errors: area.errors.full_messages }
      end
    end
  end
end
