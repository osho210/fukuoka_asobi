class CreateStoreMenus < ActiveRecord::Migration[8.0]
  def change
    create_table :store_menus do |t|
      t.references :store, null: false, foreign_key: true
      t.references :menu, null: false, foreign_key: true

      t.timestamps
    end

    add_index :store_menus, [:store_id, :menu_id], unique: true
  end
end
