# frozen_string_literal: true

module Resolvers
  class NewsResolver < BaseResolver
    type [Types::NewsType], null: false

    argument :category_id, ID, required: false
    argument :limit, Integer, required: false

    def resolve(category_id: nil, limit: nil)
      scope = News.all
      scope = scope.where(news_category_id: category_id) if category_id.present?
      scope = scope.limit(limit) if limit.present?
      scope.order(created_at: :desc)
    end
  end
end
