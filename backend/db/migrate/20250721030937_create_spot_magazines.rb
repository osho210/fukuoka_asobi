class CreateSpotMagazines < ActiveRecord::Migration[8.0]
  def change
    create_table :spot_magazines, id: false do |t|
      t.references :spot, null: false, foreign_key: true
      t.references :magazine, null: false, foreign_key: true
      t.string :publication_feature
      t.integer :page_number
      t.text :notes

      t.timestamps
    end

    add_index :spot_magazines, [:spot_id, :magazine_id], unique: true
  end
end
