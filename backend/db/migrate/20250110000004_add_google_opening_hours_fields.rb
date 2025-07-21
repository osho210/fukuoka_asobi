class AddGoogleOpeningHoursFields < ActiveRecord::Migration[8.0]
  def up
    add_column :opening_hours, :google_opening_hours_data, :text # JSON形式で保存
    add_column :opening_hours, :opening_hours_type, :string, default: 'regular'
    # regular, current, secondary_regular, current_secondary

    add_index :opening_hours, :opening_hours_type
  end

  def down
    remove_index :opening_hours, :opening_hours_type if index_exists?(:opening_hours, :opening_hours_type)
    remove_column :opening_hours, :google_opening_hours_data
    remove_column :opening_hours, :opening_hours_type
  end
end
