# app/graphql/mutations/create_district.rb
# frozen_string_literal: true

module Mutations
  class CreateDistrict < BaseMutation
    # --------- 修正 ----------
    argument :district_name, String, required: true
    # -------------------------

    field :district, Types::DistrictType, null: true
    field :errors,   [String],            null: false

    def resolve(district_name:)
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { district: nil, errors: ["管理者権限が必要です"] }
      # end

      district = District.new(district_name: district_name)

      if district.save
        { district: district, errors: [] }
      else
        { district: nil, errors: district.errors.full_messages }
      end
    end
  end
end
