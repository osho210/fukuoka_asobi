# frozen_string_literal: true

module Mutations
  class UpdateDirectionCard < BaseMutation
    argument :id, ID, required: true
    argument :text, String, required: false
    argument :tags, String, required: false
    argument :weight, Integer, required: false
    argument :active, Boolean, required: false

    field :direction_card, Types::DirectionCardType, null: true
    field :errors, [String], null: false

    def resolve(id:, **attributes)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { direction_card: nil, errors: ["管理者権限が必要です"] }
      end

      direction_card = DirectionCard.find_by(id: id)

      unless direction_card
        return { direction_card: nil, errors: ["方向性カードが見つかりません"] }
      end

      if direction_card.update(attributes.compact)
        { direction_card: direction_card, errors: [] }
      else
        { direction_card: nil, errors: direction_card.errors.full_messages }
      end
    end
  end
end
