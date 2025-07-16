class CreateMenuCategories < ActiveRecord::Migration[8.0]
  def change
    create_table :menu_categories do |t|
      t.string :name

      t.timestamps
    end
    add_index :menu_categories, :name, unique: true
  end
end
