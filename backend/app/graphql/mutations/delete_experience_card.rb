# frozen_string_literal: true

module Mutations
  class DeleteExperienceCard < BaseMutation
    argument :id, ID, required: true

    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { success: false, errors: ["管理者権限が必要です"] }
      end

      experience_card = ExperienceCard.find_by(id: id)

      unless experience_card
        return { success: false, errors: ["体験カードが見つかりません"] }
      end

      if experience_card.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: experience_card.errors.full_messages }
      end
    end
  end
end
