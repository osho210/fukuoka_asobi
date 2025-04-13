# frozen_string_literal: true

module Types
  class BookmarkType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, Integer, null: false
    field :bookmarkable_type, String, null: false
    field :bookmarkable_id, Integer, null: false
    field :title, String
    field :note, String
    field :category, String
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    # ブックマークされたオブジェクトを取得するフィールド
    field :bookmarkable, Types::BookmarkableUnion, null: true

    def bookmarkable
      case object.bookmarkable_type
      when "PlayPlan"
        PlayPlan.find_by(id: object.bookmarkable_id)
      else
        nil
      end
    end
  end
end
