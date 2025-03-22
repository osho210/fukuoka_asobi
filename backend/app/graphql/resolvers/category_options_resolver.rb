# frozen_string_literal: true

module Resolvers
  class CategoryOptionsResolver < Resolvers::BaseResolver
    type [Types::CategoryOptionType], null: false

    def resolve
      [
        { id: 'onsen', label: '温泉' },
        { id: 'museum', label: '美術館' },
        { id: 'izakaya', label: '居酒屋' },
        { id: 'roadstation', label: '道の駅' },
        { id: 'experience', label: '体験' },
        { id: 'scenery', label: '絶景' },
        { id: 'cafe', label: 'カフェ' },
        { id: 'shopping', label: 'ショッピング' },
        { id: 'park', label: '公園' },
        { id: 'shrine', label: '神社・寺' }
      ]
    end
  end
end
