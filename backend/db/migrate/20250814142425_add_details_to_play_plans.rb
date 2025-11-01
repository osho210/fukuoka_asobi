class AddDetailsToPlayPlans < ActiveRecord::Migration[8.0]
  def change
    add_column :play_plans, :catch_copy, :string
    add_column :play_plans, :subtitle, :string
    add_column :play_plans, :lead_text, :text
  end
end
