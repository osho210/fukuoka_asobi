# frozen_string_literal: true

module Types
  class BucketListItemStatusEnumType < Types::BaseEnum
    description "バケットリスト企画ステータス"
    value "DRAFT", value: "draft", description: "下書き"
    value "PUBLISHED", value: "published", description: "公開済み"
    value "ARCHIVED", value: "archived", description: "アーカイブ"
  end
end
