# frozen_string_literal: true

module Resolvers
  class NewsDetailResolver < BaseResolver
    type Types::NewsType, null: true

    argument :id, ID, required: true

    def resolve(id:)
      News.find_by(id: id)
    end
  end
end
