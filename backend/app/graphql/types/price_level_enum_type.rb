# frozen_string_literal: true

module Types
    class PriceLevelEnumType < Types::BaseEnum
      description "価格レベル"

      value "PRICE_LEVEL_UNSPECIFIED", "未指定", value: "PRICE_LEVEL_UNSPECIFIED"
      value "PRICE_LEVEL_FREE", "無料", value: "PRICE_LEVEL_FREE"
      value "PRICE_LEVEL_INEXPENSIVE", "手頃な価格", value: "PRICE_LEVEL_INEXPENSIVE"
      value "PRICE_LEVEL_MODERATE", "中程度の価格", value: "PRICE_LEVEL_MODERATE"
      value "PRICE_LEVEL_EXPENSIVE", "高価", value: "PRICE_LEVEL_EXPENSIVE"
      value "PRICE_LEVEL_VERY_EXPENSIVE", "非常に高価", value: "PRICE_LEVEL_VERY_EXPENSIVE"
    end
end
