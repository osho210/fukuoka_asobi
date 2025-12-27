# frozen_string_literal: true

module Types
  class ExperienceCardType < Types::BaseObject
    description "体験カード"

    field :id, ID, null: false, description: "カードID"
    field :title, String, null: false, description: "タイトル"
    field :body, String, null: true, description: "本文"
    field :truncated_body, String, null: true, description: "省略された本文" do
      argument :length, Integer, required: false, description: "省略文字数（デフォルト100）"
    end
    field :tags, [String], null: true, description: "タグ配列"
    field :area, String, null: true, description: "エリア"
    field :duration, Integer, null: true, description: "所要時間（分）"
    field :time_slot, String, null: true, description: "時間帯（朝、昼、夜など）"
    field :active, Boolean, null: false, description: "アクティブ状態"
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false, description: "作成日時"
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false, description: "更新日時"

    def tags
      object.tag_array
    end

    def truncated_body(length: 100)
      object.truncated_body(length)
    end
  end
end
