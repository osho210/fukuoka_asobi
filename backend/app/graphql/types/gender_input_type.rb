module Types
  class GenderInputType < Types::BaseInputObject
    description "性別と人数の入力"

    argument :male, Integer, required: true, description: "男性の人数"
    argument :female, Integer, required: true, description: "女性の人数"
  end
end
