# frozen_string_literal: true

module Mutations
  class CreateDirectionCard < BaseMutation
    argument :text, String, required: true
    argument :tags, String, required: false
    argument :weight, Integer, required: false
    argument :active, Boolean, required: false

    field :direction_card, Types::DirectionCardType, null: true
    field :errors, [String], null: false

    def resolve(text:, tags: nil, weight: 1, active: true)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { direction_card: nil, errors: ["管理者権限が必要です"] }
      end

      direction_card = DirectionCard.new(
        text: text,
        tags: tags,
        weight: weight,
        active: active
      )

      if direction_card.save
        { direction_card: direction_card, errors: [] }
      else
        { direction_card: nil, errors: direction_card.errors.full_messages }
      end
    end
  end
end
