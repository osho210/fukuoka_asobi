# frozen_string_literal: true

module Mutations
  class DeleteBookmark < BaseMutation
    description "ブックマークを削除します"

    # 入力フィールド
    argument :id, ID, required: true

    # 出力フィールド
    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      # 現在のユーザーを取得
      current_user = context[:current_user]

      # ユーザーが認証されていない場合はエラー
      unless current_user
        return {
          success: false,
          errors: ["認証されていません。ログインしてください。"]
        }
      end

      # ブックマークを取得
      bookmark = current_user.bookmarks.find_by(id: id)

      # ブックマークが存在しない場合はエラー
      unless bookmark
        return {
          success: false,
          errors: ["ブックマークが見つかりません。"]
        }
      end

      # ブックマークを削除
      if bookmark.destroy
        {
          success: true,
          errors: []
        }
      else
        {
          success: false,
          errors: bookmark.errors.full_messages
        }
      end
    end
  end
end
