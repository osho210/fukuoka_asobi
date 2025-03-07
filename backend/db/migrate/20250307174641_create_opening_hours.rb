class CreateOpeningHours < ActiveRecord::Migration[8.0]
  def change
    create_table :opening_hours do |t|
      t.references :store, null: false, foreign_key: true
      t.string :day_of_week, null: false
      t.time :open_time, null: false
      t.time :close_time, null: false

      t.timestamps
    end

    add_index :opening_hours, [:store_id, :day_of_week], unique: true
  end
end
