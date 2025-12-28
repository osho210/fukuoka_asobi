# frozen_string_literal: true

module Types
  class BucketListItemReferenceTypeEnumType < Types::BaseEnum
    description "参考リンク種別"
    value "OFFICIAL", value: "official", description: "公式サイト"
    value "MAP", value: "map", description: "地図"
    value "ARTICLE", value: "article", description: "記事"
    value "RESERVATION", value: "reservation", description: "予約"
    value "OTHER", value: "other", description: "その他"
  end
end
