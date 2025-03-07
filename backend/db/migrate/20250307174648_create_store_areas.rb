class CreateStoreAreas < ActiveRecord::Migration[8.0]
  def change
    create_table :store_areas do |t|
      t.references :store, null: false, foreign_key: true
      t.references :area, null: false, foreign_key: true

      t.timestamps
    end

    add_index :store_areas, [:store_id, :area_id], unique: true
  end
end
