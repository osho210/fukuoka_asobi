# frozen_string_literal: true

module Types
  class BudgetTypeRangeEnumType < Types::BaseEnum
    description "価格帯を表す列挙型"

    value "CHEAP", "安い"
    value "AVERAGE", "普通"
    value "EXPENSIVE", "高い"
  end
end
