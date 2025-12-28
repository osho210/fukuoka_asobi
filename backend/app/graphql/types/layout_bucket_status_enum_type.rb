# frozen_string_literal: true

module Types
  class LayoutBucketStatusEnumType < Types::BaseEnum
    description "レイアウトバケットステータス"
    value "ACTIVE", value: "active", description: "有効"
    value "INACTIVE", value: "inactive", description: "無効"
  end
end
