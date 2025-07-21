class AddMenuCategoryToMenus < ActiveRecord::Migration[8.0]
  def change
    unless column_exists?(:menus, :menu_category_id)
      add_reference :menus, :menu_category, null: false, foreign_key: true
    end
  end
end
