# app/graphql/mutations/delete_district.rb
# frozen_string_literal: true

module Mutations
  class DeleteDistrict < BaseMutation
    # --------- 修正 ----------
    argument :id, ID, required: true
    # -------------------------

    field :success, Boolean, null: false
    field :errors,  [String], null: false

    def resolve(id:)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { success: false, errors: ["管理者権限が必要です"] }
      end

      district = District.find_by(id: id)
      return { success: false, errors: ["指定された地区が見つかりません"] } unless district

      if district.areas.exists?
        return { success: false, errors: ["この地区に関連付けられたエリアが存在するため削除できません"] }
      end

      if district.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: district.errors.full_messages }
      end
    end
  end
end
