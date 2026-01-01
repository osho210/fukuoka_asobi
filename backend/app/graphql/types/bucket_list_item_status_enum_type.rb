# frozen_string_literal: true

module Types
  class BucketListItemStatusEnumType < Types::BaseEnum
    description "バケットリスト企画ステータス"
    value "draft", value: "draft", description: "下書き"
    value "published", value: "published", description: "公開済み"
    value "archived", value: "archived", description: "アーカイブ"
  end
end
