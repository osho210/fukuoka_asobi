# frozen_string_literal: true

module Mutations
  class DeleteRecommendedFor < BaseMutation
    argument :id, ID, required: true

    field :success, Boolean, null: false
    field :errors,  [String], null: false

    def resolve(id:)
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { success: false, errors: ["管理者権限が必要です"] }
      # end

      recommended_for = RecommendedFor.find_by(id: id)
      return { success: false, errors: ["指定されたおすすめ対象が見つかりません"] } unless recommended_for

      if recommended_for.play_plans.exists?
        return { success: false, errors: ["このおすすめ対象に関連付けられたプランが存在するため削除できません"] }
      end

      if recommended_for.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: recommended_for.errors.full_messages }
      end
    end
  end
end
