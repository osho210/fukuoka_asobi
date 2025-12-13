# app/graphql/mutations/delete_spot_ambiance.rb
# frozen_string_literal: true

module Mutations
  class DeleteSpotAmbiance < BaseMutation
    # -------- 変更 ----------
    argument :id, ID, required: true
    # ------------------------

    field :success, Boolean, null: false
    field :errors,  [String], null: false

    def resolve(id:)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
      #   return { success: false, errors: ["管理者権限が必要です"] }
      # end

      spot_ambiance = SpotAmbiance.find_by(id: id)
      return { success: false, errors: ["指定された雰囲気が見つかりません"] } unless spot_ambiance

      if spot_ambiance.spots.exists?
        return { success: false, errors: ["この雰囲気に関連付けられたスポットが存在するため削除できません"] }
      end

      if spot_ambiance.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: spot_ambiance.errors.full_messages }
      end
    end
  end
end
