# frozen_string_literal: true

module Mutations
  class DeleteDirectionCard < BaseMutation
    argument :id, ID, required: true

    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { success: false, errors: ["管理者権限が必要です"] }
      end

      direction_card = DirectionCard.find_by(id: id)

      unless direction_card
        return { success: false, errors: ["方向性カードが見つかりません"] }
      end

      if direction_card.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: direction_card.errors.full_messages }
      end
    end
  end
end
