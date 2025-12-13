# app/graphql/mutations/delete_area.rb
# frozen_string_literal: true

module Mutations
  class DeleteArea < BaseMutation
    # ------------- 修正 -------------
    argument :id, ID, required: true
    # --------------------------------

    field :success, Boolean, null: false
    field :errors,  [String], null: false

    def resolve(id:)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
      #   return { success: false, errors: ["管理者権限が必要です"] }
      # end

      area = Area.find_by(id: id)
      return { success: false, errors: ["指定されたエリアが見つかりません"] } unless area

      if area.spots.exists?
        return { success: false, errors: ["このエリアに関連付けられたスポットが存在するため削除できません"] }
      end

      if area.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: area.errors.full_messages }
      end
    end
  end
end
