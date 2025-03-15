# frozen_string_literal: true

module Types
  class TripTypeEnum < Types::BaseEnum
    description "旅行タイプ"

    value "DAY_TRIP", value: "day_trip", description: "日帰り"
    value "OVERNIGHT", value: "overnight", description: "泊まり"
  end
end
