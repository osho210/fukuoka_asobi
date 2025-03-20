class RemoveRecommendedForFromPlayPlans < ActiveRecord::Migration[8.0]
  def change
    remove_column :play_plans, :recommended_for, :string
  end
end
