# frozen_string_literal: true

module Resolvers
  class ThemeOptionsResolver < Resolvers::BaseResolver
    type [Types::ThemeOptionType], null: false

    def resolve
      [
        { id: 'healing', label: '癒しの旅' },
        { id: 'active', label: 'アクティブ' },
        { id: 'costeffective', label: 'コスパ' },
        { id: 'gourmet', label: 'グルメ' },
        { id: 'nature', label: '自然' },
        { id: 'culture', label: '文化と歴史' }
      ]
    end
  end
end
