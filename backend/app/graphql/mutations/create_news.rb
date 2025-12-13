# frozen_string_literal: true
module Mutations
    class CreateNews < BaseMutation
        argument :title, String, required: true
        argument :body, String, required: true
        argument :published_at, GraphQL::Types::ISO8601DateTime, required: false
        argument :status, Types::StatusEnumType, required: false
        argument :image_url, String, required: false
        argument :author_id, ID, required: false
        argument :category_id, ID, required: false

        field :news, Types::NewsType, null: true
        field :errors, [String], null: false

        def resolve(**args)
            # 管理者権限チェック
            unless context[:current_user]&.admin?
              return { news: nil, errors: ["管理者権限が必要です"] }
              end

            news = News.new(args)

            if news.save
                { news: news, errors: [] }
            else
                { news: nil, errors: news.errors.full_messages }
            end
        end
    end
end