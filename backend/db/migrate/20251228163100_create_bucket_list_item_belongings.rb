class CreateBucketListItemBelongings < ActiveRecord::Migration[8.0]
  def change
    create_table :bucket_list_item_belongings do |t|
      t.references :bucket_list_item, null: false, foreign_key: { on_delete: :cascade }

      t.string :name, null: false, limit: 255
      t.string :note, limit: 255
      t.integer :sort_order, null: false, default: 0

      t.timestamps
    end
  end
end
