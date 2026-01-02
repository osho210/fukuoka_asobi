# frozen_string_literal: true

module Mutations
  class UpdateExperienceCard < BaseMutation
    argument :id, ID, required: true
    argument :title, String, required: false
    argument :body, String, required: false
    argument :tags, [String], required: false, description: "タグ配列"
    argument :area, String, required: false
    argument :duration, String, required: false, description: "所要時間（例：2時間、30分など）"
    argument :time_slot, String, required: false
    argument :active, Boolean, required: false

    field :experience_card, Types::ExperienceCardType, null: true
    field :errors, [String], null: false

    def resolve(id:, **attributes)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { experience_card: nil, errors: ["管理者権限が必要です"] }
      end

      experience_card = ExperienceCard.find_by(id: id)

      unless experience_card
        return { experience_card: nil, errors: ["体験カードが見つかりません"] }
      end

      if experience_card.update(attributes.compact)
        { experience_card: experience_card, errors: [] }
      else
        { experience_card: nil, errors: experience_card.errors.full_messages }
      end
    end
  end
end
