class CreateTravelDetails < ActiveRecord::Migration[8.0]
  def change
    create_table :travel_details do |t|
      t.references :plan_detail, null: false, foreign_key: true
      t.integer :sequence_number, null: false
      t.string :travel_method, null: false
      t.integer :travel_time
      t.text :notes

      t.timestamps
    end

    add_index :travel_details, [:plan_detail_id, :sequence_number], unique: true
  end
end
