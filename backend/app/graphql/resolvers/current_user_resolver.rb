# frozen_string_literal: true

module Resolvers
  class CurrentUserResolver < Resolvers::BaseResolver
    type Types::UserType, null: true
    description "現在ログインしているユーザーを取得します"

    def resolve
      context[:current_user]
    end
  end
end
