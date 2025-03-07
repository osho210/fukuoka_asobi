class CreateAreas < ActiveRecord::Migration[8.0]
  def change
    create_table :areas do |t|
      t.string :area_name, null: false
      t.references :district, null: false, foreign_key: true

      t.timestamps
    end
    add_index :areas, [:area_name, :district_id], unique: true
  end
end
