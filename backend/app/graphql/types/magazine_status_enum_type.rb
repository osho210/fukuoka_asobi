# frozen_string_literal: true

module Types
  class MagazineStatusEnumType < Types::BaseEnum
    description "雑誌の公開ステータス"
    value "draft", value: "draft", description: "下書き"
    value "published", value: "published", description: "公開済み"
  end
end
