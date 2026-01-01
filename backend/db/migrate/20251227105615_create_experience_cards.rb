class CreateExperienceCards < ActiveRecord::Migration[8.0]
  def change
    create_table :experience_cards do |t|
      t.string :title, null: false
      t.text :body
      t.string :tags
      t.string :area
      t.integer :duration
      t.string :time_slot
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :experience_cards, :active
    add_index :experience_cards, :tags
  end
end
