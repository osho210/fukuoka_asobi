module Resolvers
  class NewsResolver < Resolvers::BaseResolver
    type [Types::NewsType], null: false

    argument :category_id, ID, required: false
    argument :limit, Integer, required: false, default_value: 10
    argument :id, ID, required: false

    def resolve(category_id: nil, limit: nil, id: nil)
      if id.present?
        # IDが指定された場合は単一のニュース記事を返す
        news = News.published.where(id: id)
        news = news.limit(limit) if limit.present?
      else
        # IDが指定されていない場合は複数のニュース記事を返す
        news = News.published.recent.limit(limit)
        news = news.by_category(category_id) if category_id.present?
      end

      news
    end
  end
end
