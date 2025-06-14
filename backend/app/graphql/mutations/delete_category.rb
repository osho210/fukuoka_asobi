# app/graphql/mutations/delete_category.rb
# frozen_string_literal: true

module Mutations
  class DeleteCategory < BaseMutation
    # -------- 修正 --------
    argument :id, ID, required: true
    # ----------------------

    field :success, Boolean, null: false
    field :errors,  [String], null: false

    def resolve(id:)
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { success: false, errors: ["管理者権限が必要です"] }
      # end

      category = Category.find_by(id: id)
      return { success: false, errors: ["指定されたカテゴリーが見つかりません"] } unless category

      if category.spots.exists?
        return { success: false, errors: ["このカテゴリーに関連付けられたスポットが存在するため削除できません"] }
      end

      if category.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: category.errors.full_messages }
      end
    end
  end
end
