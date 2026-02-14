class CreateLicensedAssets < ActiveRecord::Migration[8.0]
  def change
    create_table :licensed_assets do |t|
      t.references :spot, null: false, foreign_key: true
      t.references :consent_agreement, null: false, foreign_key: true
      t.string :asset_type, null: false # UPLOAD or URL
      t.string :asset_url # URL if asset_type is URL
      t.string :source_url # Original post URL
      t.text :caption_note
      t.boolean :usable, default: true, null: false
      t.timestamps
    end

    add_index :licensed_assets, :spot_id
    add_index :licensed_assets, :consent_agreement_id
    add_index :licensed_assets, :usable
  end
end
