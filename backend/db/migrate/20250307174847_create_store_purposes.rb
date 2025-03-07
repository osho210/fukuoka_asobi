class CreateStorePurposes < ActiveRecord::Migration[8.0]
  def change
    create_table :store_purposes do |t|
      t.references :store, null: false, foreign_key: true
      t.references :purpose, null: false, foreign_key: true

      t.timestamps
    end

    add_index :store_purposes, [:store_id, :purpose_id], unique: true
  end
end
