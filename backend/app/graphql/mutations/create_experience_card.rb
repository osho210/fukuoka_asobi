# frozen_string_literal: true

module Mutations
  class CreateExperienceCard < BaseMutation
    argument :title, String, required: true
    argument :body, String, required: false
    argument :tags, String, required: false
    argument :area, String, required: false
    argument :duration, Integer, required: false
    argument :time_slot, String, required: false
    argument :active, Boolean, required: false

    field :experience_card, Types::ExperienceCardType, null: true
    field :errors, [String], null: false

    def resolve(title:, body: nil, tags: nil, area: nil, duration: nil, time_slot: nil, active: true)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { experience_card: nil, errors: ["管理者権限が必要です"] }
      end

      experience_card = ExperienceCard.new(
        title: title,
        body: body,
        tags: tags,
        area: area,
        duration: duration,
        time_slot: time_slot,
        active: active
      )

      if experience_card.save
        { experience_card: experience_card, errors: [] }
      else
        { experience_card: nil, errors: experience_card.errors.full_messages }
      end
    end
  end
end
