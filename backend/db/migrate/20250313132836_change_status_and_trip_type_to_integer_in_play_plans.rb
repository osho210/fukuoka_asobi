class ChangeStatusAndTripTypeToIntegerInPlayPlans < ActiveRecord::Migration[8.0]
  def change
    change_column :play_plans, :status, :integer, default: 0, null: false
    change_column :play_plans, :trip_type, :integer, default: 0, null: false
  end
end
