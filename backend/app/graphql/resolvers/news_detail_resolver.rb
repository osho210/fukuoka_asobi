module Resolvers
  class NewsDetailResolver < Resolvers::BaseResolver
    type Types::NewsType, null: true

    argument :id, ID, required: true

    def resolve(id:)
      News.published.find_by(id: id)
    end
  end
end
