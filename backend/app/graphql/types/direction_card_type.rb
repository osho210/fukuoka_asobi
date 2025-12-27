# frozen_string_literal: true

module Types
  class DirectionCardType < Types::BaseObject
    description "方向性カード"

    field :id, ID, null: false, description: "カードID"
    field :text, String, null: false, description: "カードのテキスト（1〜2行の短文）"
    field :tags, [String], null: true, description: "タグ配列"
    field :weight, Integer, null: false, description: "重み（表示される確率に影響）"
    field :active, Boolean, null: false, description: "アクティブ状態"
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false, description: "作成日時"
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false, description: "更新日時"

    def tags
      object.tag_array
    end
  end
end
