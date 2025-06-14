# frozen_string_literal: true

module Types
  class StatusEnumType < Types::BaseEnum
    description "プランのステータス"

    value "DRAFT", "下書き", value: "draft"
    value "PUBLISHED", "公開", value: "published"
    value "ARCHIVED", "アーカイブ", value: "archived"
    value "DELETED",  "削除", value: "deleted"
  end
end
