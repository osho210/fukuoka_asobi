class CreatePlayPlans < ActiveRecord::Migration[8.0]
  def change
    create_table :play_plans do |t|
      t.integer :user_id
      t.string :plan_name, null: false
      t.datetime :start_datetime
      t.datetime :end_datetime
      t.text :description
      t.string :status, default: '下書き'
      t.integer :favorite_count, default: 0
      t.decimal :rating, precision: 3, scale: 2, default: 0.0
      t.integer :review_count, default: 0
      t.string :image_url
      t.string :tags
      t.string :location
      t.datetime :published_at
      t.string :trip_type, default: '日帰り'
      t.decimal :total_budget, precision: 10, scale: 2
      t.string :recommended_for

      t.timestamps
    end
  end
end
