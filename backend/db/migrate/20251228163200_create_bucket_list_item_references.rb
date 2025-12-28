class CreateBucketListItemReferences < ActiveRecord::Migration[8.0]
  def change
    create_table :bucket_list_item_references do |t|
      t.references :bucket_list_item, null: false, foreign_key: { on_delete: :cascade }

      t.string :title, limit: 255
      t.text :url, null: false
      t.string :reference_type, null: false, default: 'other', limit: 32, comment: '参考リンク種別（official, map, article, reservation, other）'
      t.integer :sort_order, null: false, default: 0

      t.timestamps
    end
  end
end
