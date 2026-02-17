# frozen_string_literal: true

module Types
  class SeoIndexRowType < Types::BaseObject
    description "SEOインデックス管理用のレコード情報"

    field :id, ID, null: false, description: "レコードID"
    field :title, String, null: false, description: "タイトル (spot_name / plan_name)"
    field :type, String, null: false, description: "レコード種別 (spot | plan)"
    field :status, String, null: false, description: "公開ステータス"
    field :is_indexable, Boolean, null: false, description: "検索エンジンにインデックスさせるか"
    field :url, String, null: false, description: "詳細ページURL"
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false, description: "更新日時"
  end
end
