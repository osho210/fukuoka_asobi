class AddSlugToDistricts < ActiveRecord::Migration[8.0]
  def change
    add_column :districts, :slug, :string
    add_index :districts, :slug, unique: true
  end
end
