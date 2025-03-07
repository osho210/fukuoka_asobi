class CreateStores < ActiveRecord::Migration[8.0]
  def change
    create_table :stores do |t|
      t.references :district, null: false, foreign_key: true
      t.string :store_name, null: false
      t.string :address
      t.string :phone_number
      t.string :website
      t.string :catchphrase
      t.string :recommended_for_1
      t.string :recommended_for_2
      t.boolean :parking_available, default: false
      t.string :nearest_station
      t.decimal :review_rating, precision: 3, scale: 2, default: 0.0
      t.integer :review_count, default: 0
      t.string :instagram_url
      t.boolean :is_closed, default: false
      t.string :budget_range, default: '普通'
      t.integer :max_people
      t.integer :min_people, default: 1
      t.boolean :is_rainy_ok, default: true
      t.string :theme

      t.timestamps
    end

    add_index :stores, :store_name
    add_index :stores, :budget_range
    add_index :stores, :theme
  end
end
