class CreateBookmarks < ActiveRecord::Migration[7.0]
  def change
    create_table :bookmarks do |t|
      t.references :user, null: false, foreign_key: true
      t.references :bookmarkable, polymorphic: true, null: false
      t.string :title
      t.text :note
      t.string :category

      t.timestamps
    end

    # ユーザーごとに同じアイテムを重複してブックマークできないようにするインデックス
    add_index :bookmarks, [:user_id, :bookmarkable_type, :bookmarkable_id], unique: true, name: 'index_bookmarks_on_user_and_bookmarkable'
  end
end
