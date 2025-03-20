class AddPlannerFieldsToPlanDetails < ActiveRecord::Migration[8.0]
  def change
    add_column :plan_details, :planner_title, :string
    add_column :plan_details, :planner_description, :text
  end
end
