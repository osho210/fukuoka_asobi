class RemoveImageFilenameFromMenus < ActiveRecord::Migration[8.0]
  def change
    remove_column :menus, :image_filename, :string
  end
end
