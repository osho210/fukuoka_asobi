module Resolvers
  class NewsResolver < Resolvers::BaseResolver
    type [Types::NewsType], null: false

    argument :category_id, ID, required: false
    argument :limit, Integer, required: false, default_value: 10

    def resolve(category_id: nil, limit: 10)
      news = News.published.recent.limit(limit)
      news = news.by_category(category_id) if category_id.present?
      news
    end
  end
end
