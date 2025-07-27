class AddImageFilenameToMenus < ActiveRecord::Migration[8.0]
  def change
    add_column :menus, :image_filename, :string
  end
end
