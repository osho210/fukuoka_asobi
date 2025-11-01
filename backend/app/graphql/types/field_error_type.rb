module Types
  class FieldErrorType < Types::BaseObject
    description "フィールドエラー情報"

    field :field, String, null: false, description: "エラーが発生したフィールド名"
    field :message, String, null: false, description: "エラーメッセージ"
  end
end
