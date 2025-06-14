class Station < ActiveRecord::Migration[8.0]
  def change
    add_column :stations, :train_line, :string, null: false
  end
end
