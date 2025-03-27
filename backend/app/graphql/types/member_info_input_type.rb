module Types
  class MemberInfoInputType < Types::BaseInputObject
    description "利用メンバー情報の入力"

    argument :recommended_for_ids, [ID], required: true, description: "おすすめ対象ID"
  end
end
