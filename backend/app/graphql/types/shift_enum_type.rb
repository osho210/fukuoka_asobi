# frozen_string_literal: true

module Types
  class ShiftEnumType < Types::BaseEnum
    description "ズレ方向"
    value "NONE", value: "none", description: "ズレなし"
    value "UP", value: "up", description: "上にズレ"
    value "DOWN", value: "down", description: "下にズレ"
    value "LEFT", value: "left", description: "左にズレ"
    value "RIGHT", value: "right", description: "右にズレ"
  end
end
