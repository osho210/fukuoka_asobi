class ChangeColumnTobucketListItem < ActiveRecord::Migration[8.0]
  def change
    add_column :bucket_list_items, :top_display_flag, :boolean, default: false, null: false
  end
end
