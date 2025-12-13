# frozen_string_literal: true

module Resolvers
  class NewsResolver < BaseResolver
    type [Types::NewsType], null: false

    argument :category_id, ID, required: false
    argument :limit, Integer, required: false

    def resolve(category_id: nil, limit: nil)
      scope = News.published.by_category(category_id).recent
      scope = scope.limit(limit) if limit.present?
      scope
    end
  end
end
