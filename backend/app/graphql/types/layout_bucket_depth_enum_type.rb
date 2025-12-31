# frozen_string_literal: true

module Types
  class LayoutBucketDepthEnumType < Types::BaseEnum
    description "レイアウトバケットの奥行き表現"
    value "FLAT", value: "flat", description: "フラット"
    value "LIFT", value: "lift", description: "浮かせ"
  end
end
