class AddDescriptionToSpots < ActiveRecord::Migration[8.0]
  def change
    add_column :spots, :description, :text
  end
end
