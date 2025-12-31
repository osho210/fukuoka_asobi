# frozen_string_literal: true

module Types
  class LayoutBucketTiltEnumType < Types::BaseEnum
    description "レイアウトバケットの傾き"
    value "NO_TILT", value: "no_tilt", description: "傾きなし"
    value "CW", value: "cw", description: "時計回り"
    value "CCW", value: "ccw", description: "反時計回り"
  end
end
