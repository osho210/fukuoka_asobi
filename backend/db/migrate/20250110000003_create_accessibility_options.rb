class CreateAccessibilityOptions < ActiveRecord::Migration[8.0]
  def up
    create_table :accessibility_options do |t|
      t.string :name, null: false
      t.text :description
      t.timestamps
    end

    add_index :accessibility_options, :name, unique: true

    create_table :spot_accessibility_options do |t|
      t.references :spot, null: false, foreign_key: true, type: :bigint
      t.references :accessibility_option, null: false, foreign_key: true
      t.boolean :available, default: true
      t.timestamps
    end

    add_index :spot_accessibility_options, [:spot_id, :accessibility_option_id],
              unique: true, name: 'index_spot_accessibility_unique'
  end

  def down
    drop_table :spot_accessibility_options
    drop_table :accessibility_options
  end
end
