class CreateStoreCategories < ActiveRecord::Migration[8.0]
  def change
    create_table :store_categories do |t|
      t.references :store, null: false, foreign_key: true
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end

    add_index :store_categories, [:store_id, :category_id], unique: true
  end
end
