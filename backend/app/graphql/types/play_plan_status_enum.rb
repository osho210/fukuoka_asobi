# frozen_string_literal: true

module Types
  class PlayPlanStatusEnum < Types::BaseEnum
    description "プランのステータス"

    value "DRAFT", value: "draft", description: "下書き"
    value "PUBLISHED", value: "published", description: "公開"
  end
end
