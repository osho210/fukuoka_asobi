# frozen_string_literal: true

module Resolvers
  class TransportationOptionsResolver < Resolvers::BaseResolver
    type [Types::TransportationOptionType], null: false

    def resolve
      [
        { id: 'walk', label: '徒歩' },
        { id: 'train', label: '電車' },
        { id: 'car', label: '車' },
        { id: 'bicycle', label: '自転車' },
        { id: 'other', label: 'その他' }
      ]
    end
  end
end
