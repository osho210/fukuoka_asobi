class ChangeUrlColumnsInMagazines < ActiveRecord::Migration[7.1]
  def change
    change_column :magazines, :cover_image_url, :text
    change_column :magazines, :sales_url, :text
  end
end
