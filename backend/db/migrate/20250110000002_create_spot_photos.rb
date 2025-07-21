class CreateSpotPhotos < ActiveRecord::Migration[8.0]
  def up
    create_table :spot_photos do |t|
      t.references :spot, null: false, foreign_key: true, type: :bigint
      t.string :photo_reference, null: false, limit: 500
      t.integer :width
      t.integer :height
      t.text :html_attributions
      t.timestamps
    end

    add_index :spot_photos, :photo_reference
    add_index :spot_photos, [:spot_id, :photo_reference], unique: true
  end

  def down
    drop_table :spot_photos
  end
end
