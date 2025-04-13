# frozen_string_literal: true

module Mutations
  class CreateBookmark < BaseMutation
    description "ブックマークを作成します"

    # 入力フィールド
    argument :bookmarkable_type, String, required: true
    argument :bookmarkable_id, ID, required: true
    argument :title, String, required: false
    argument :note, String, required: false
    argument :category, String, required: false

    # 出力フィールド
    field :bookmark, Types::BookmarkType, null: true
    field :errors, [String], null: false

    def resolve(bookmarkable_type:, bookmarkable_id:, title: nil, note: nil, category: nil)
      # 現在のユーザーを取得
      current_user = context[:current_user]

      # ユーザーが認証されていない場合はエラー
      unless current_user
        return {
          bookmark: nil,
          errors: ["認証されていません。ログインしてください。"]
        }
      end

      # ブックマーク対象のオブジェクトを取得
      bookmarkable = case bookmarkable_type
                     when "PlayPlan"
                       PlayPlan.find_by(id: bookmarkable_id)
                     else
                       nil
                     end

      # ブックマーク対象が存在しない場合はエラー
      unless bookmarkable
        return {
          bookmark: nil,
          errors: ["ブックマーク対象が見つかりません。"]
        }
      end

      # ブックマークを作成
      bookmark = current_user.bookmarks.new(
        bookmarkable: bookmarkable,
        title: title,
        note: note,
        category: category
      )

      if bookmark.save
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
