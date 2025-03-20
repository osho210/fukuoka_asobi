class AddPlannerFieldsToPlayPlans < ActiveRecord::Migration[8.0]
  def change
    add_column :play_plans, :planner_title, :string
    add_column :play_plans, :planner_description, :text
  end
end
