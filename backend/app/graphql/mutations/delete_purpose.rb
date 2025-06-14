# app/graphql/mutations/delete_purpose.rb
# frozen_string_literal: true

module Mutations
  class DeletePurpose < BaseMutation
    # ------------- 変更 -------------
    argument :id, ID, required: true
    # --------------------------------

    field :success, Boolean, null: false
    field :errors,  [String], null: false

    def resolve(id:)
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { success: false, errors: ["管理者権限が必要です"] }
      # end

      purpose = Purpose.find_by(id: id)
      return { success: false, errors: ["指定された目的が見つかりません"] } unless purpose

      if purpose.spots.exists?
        return { success: false, errors: ["この目的に関連付けられたスポットが存在するため削除できません"] }
      end

      if purpose.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: purpose.errors.full_messages }
      end
    end
  end
end
