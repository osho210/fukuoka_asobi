class PlayPlans < ActiveRecord::Migration[8.0]
  def change
    add_column :play_plans, :departure, :string
    add_column :play_plans, :departure_time, :time
    add_column :play_plans, :travel_method_to_first_spot, :string
    add_column :play_plans, :travel_time_to_first_spot, :integer
  end
end
