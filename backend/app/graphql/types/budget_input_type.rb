module Types
  class BudgetInputType < Types::BaseInputObject
    description "予算範囲の入力"

    argument :min, Integer, required: false, description: "最小予算"
    argument :max, Integer, required: false, description: "最大予算"
  end
end
