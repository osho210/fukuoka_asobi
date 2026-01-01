# frozen_string_literal: true

module Types
  class DepthEnumType < Types::BaseEnum
    description "奥行き表現"
    value "FLAT", value: "flat", description: "フラット"
    value "LIFT", value: "lift", description: "浮き上がり"
  end
end
