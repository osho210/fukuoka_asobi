# frozen_string_literal: true

module Mutations
  class UpdateBookmark < BaseMutation
    description "ブックマークを更新します"

    # 入力フィールド
    argument :id, ID, required: true
    argument :title, String, required: false
    argument :note, String, required: false
    argument :category, String, required: false

    # 出力フィールド
    field :bookmark, Types::BookmarkType, null: true
    field :errors, [String], null: false

    def resolve(id:, title: nil, note: nil, category: nil)
      # 現在のユーザーを取得
      current_user = context[:current_user]

      # ユーザーが認証されていない場合はエラー
      unless current_user
        return {
          bookmark: nil,
          errors: ["認証されていません。ログインしてください。"]
        }
      end

      # ブックマークを取得
      bookmark = current_user.bookmarks.find_by(id: id)

      # ブックマークが存在しない場合はエラー
      unless bookmark
        return {
          bookmark: nil,
          errors: ["ブックマークが見つかりません。"]
        }
      end

      # 更新するフィールドを設定
      update_params = {}
      update_params[:title] = title if title.present?
      update_params[:note] = note if note.present?
      update_params[:category] = category if category.present?

      # ブックマークを更新
      if bookmark.update(update_params)
        {
          bookmark: bookmark,
          errors: []
        }
      else
        {
          bookmark: nil,
          errors: bookmark.errors.full_messages
        }
      end
    end
  end
end
