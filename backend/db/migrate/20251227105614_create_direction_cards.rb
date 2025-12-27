class CreateDirectionCards < ActiveRecord::Migration[8.0]
  def change
    create_table :direction_cards do |t|
      t.text :text, null: false
      t.string :tags
      t.integer :weight, default: 1
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :direction_cards, :active
  end
end
