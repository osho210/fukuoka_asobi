# frozen_string_literal: true

module Types
  class UserHistoryType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, Integer, null: false
    field :viewable_type, String, null: false
    field :viewable_id, Integer, null: false
    field :viewed_at, GraphQL::Types::ISO8601DateTime, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    # 関連するユーザーを取得するフィールド
    field :user, Types::UserType, null: false

    # 閲覧対象のオブジェクトを取得するフィールド
    field :viewable, Types::ViewableUnion, null: true

    def viewable
      # ActiveRecordのポリモーフィック関連を使用してN+1クエリを回避
      object.viewable
    end
  end
end
