class CreatePlanDetails < ActiveRecord::Migration[8.0]
  def change
    create_table :plan_details do |t|
      t.integer :plan_id, null: false
      t.integer :step_number, null: false
      t.string :step_name, null: false
      t.text :step_description
      t.integer :store_id
      t.text :comment
      t.datetime :start_datetime
      t.datetime :end_datetime
      t.decimal :budget, precision: 10, scale: 2
      t.text :notes

      t.timestamps
    end
  end
end
