class AddIsClosedDayToOpeningHours < ActiveRecord::Migration[8.0]
  def change
    add_column :opening_hours, :is_closed_day, :boolean, default: false, null: false
  end
end
