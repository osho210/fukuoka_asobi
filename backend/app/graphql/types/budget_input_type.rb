module Types
  class BudgetInputType < Types::BaseInputObject
    description "予算範囲の入力"

    argument :min, Integer, required: true, description: "最小予算"
    argument :max, Integer, required: true, description: "最大予算"
  end
end
