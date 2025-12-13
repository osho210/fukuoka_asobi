# frozen_string_literal: true
module Mutations
    class UpdateNews < BaseMutation
        argument :id, ID, required: true
        argument :title, String, required: false
        argument :body, String, required: false
        argument :published_at, GraphQL::Types::ISO8601DateTime, required: false
        argument :status, Types::StatusEnumType, required: false
        argument :image_url, String, required: false
        argument :author_id, ID, required: false
        argument :category_id, ID, required: false

        field :news, Types::NewsType, null: false
        field :errors, [String], null: false

        def resolve(**args)
            # 管理者権限チェック
            unless context[:current_user]&.admin?
              return { news: nil, errors: ["管理者権限が必要です"] }
              end

            id = args.delete(:id)
            update_attrs = args.compact # nil を除外

            news = News.find_by(id: id)
            return { news: nil, errors: ["ニュースが見つかりません"] } unless news

            ActiveRecord::Base.transaction do
                news.update!(update_attrs)
            end

            { news: news, errors: [] }

        rescue ActiveRecord::RecordInvalid => e
            raise GraphQL::ExecutionError, e.record.errors.full_messages.join(', ')
        end
    end
end

