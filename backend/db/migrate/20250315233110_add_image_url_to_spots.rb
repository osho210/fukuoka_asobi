class AddImageUrlToSpots < ActiveRecord::Migration[8.0]
  def change
    add_column :spots, :image_url, :string
  end
end
