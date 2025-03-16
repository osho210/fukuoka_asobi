# frozen_string_literal: true

module Types
  class SpotTypeEnumType < Types::BaseEnum
    description "スポットの種類を表す列挙型"

    value "STORE", "店舗"
    value "TOURIST_SPOT", "観光スポット"
    value "ACTIVITY", "アクティビティ"
  end
end
