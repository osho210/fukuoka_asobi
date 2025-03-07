class CreateMenus < ActiveRecord::Migration[8.0]
  def change
    create_table :menus do |t|
      t.string :menu_name, null: false
      t.decimal :price, precision: 10, scale: 2
      t.text :description

      t.timestamps
    end

    add_index :menus, :menu_name
  end
end
