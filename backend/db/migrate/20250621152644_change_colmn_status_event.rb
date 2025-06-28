class ChangeColmnStatusEvent < ActiveRecord::Migration[8.0]
  def change
    change_column :events, :status, :string, default: 'draft', null: false
  end
end
