module Types
  class AccessibilityOptionType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :description, String, null: true
    field :available, Boolean, null: true, description: "このスポットでの利用可能性"
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def available
      # SpotAccessibilityOptionの中間テーブルからavailableフィールドを取得
      context[:spot_accessibility_option]&.available
    end
  end
end
