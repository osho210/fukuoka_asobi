class CreateLicensedAssets < ActiveRecord::Migration[8.0]
  def change
    drop_table :licensed_assets, if_exists: true

    create_table :licensed_assets do |t|
      t.references :spot, null: false, foreign_key: true
      t.references :consent_agreement, null: false, foreign_key: true
      t.string :asset_type, null: false
      t.string :asset_url
      t.string :source_url
      t.text :caption_note
      t.boolean :usable, default: true, null: false
      t.timestamps
    end

    add_index :licensed_assets, :usable
  end
end
