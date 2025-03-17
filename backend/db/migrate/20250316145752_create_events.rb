class CreateEvents < ActiveRecord::Migration[8.0]
  def change
    create_table :events do |t|
      t.string :title
      t.text :description
      t.string :location
      t.decimal :latitude, precision: 10, scale: 7
      t.decimal :longitude, precision: 10, scale: 7
      t.datetime :start_datetime
      t.datetime :end_datetime
      t.string :recurring_rule, null: true
      t.references :event_category, null: false, foreign_key: true
      t.string :price, null: true
      t.string :organizer, null: true
      t.string :contact_email, null: true
      t.string :contact_phone, null: true
      t.integer :capacity, null: true
      t.integer :status, default: 0 # 0: draft, 1: published, 2: canceled
      t.boolean :is_online, default: false
      t.string :source_url, null: true
      t.string :banner_image, null: true

      t.timestamps
    end
  end
end
