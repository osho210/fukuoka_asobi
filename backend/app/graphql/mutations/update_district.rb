# app/graphql/mutations/update_district.rb
# frozen_string_literal: true

module Mutations
  class UpdateDistrict < BaseMutation
    # --------- 修正 ----------
    argument :id,            ID,     required: true
    argument :district_name, String, required: false
    # -------------------------

    field :district, Types::DistrictType, null: true
    field :errors,   [String],            null: false

    def resolve(id:, district_name: nil)
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { district: nil, errors: ["管理者権限が必要です"] }
      # end

      district = District.find_by(id: id)
      return { district: nil, errors: ["指定された地区が見つかりません"] } unless district

      attrs = {}
      attrs[:district_name] = district_name if district_name.present?

      if district.update(attrs)
        { district: district, errors: [] }
      else
        { district: nil, errors: district.errors.full_messages }
      end
    end
  end
end
