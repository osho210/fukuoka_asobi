class AddSlugToAreas < ActiveRecord::Migration[8.0]
  def change
    add_column :areas, :slug, :string
    add_index :areas, :slug
  end
end
