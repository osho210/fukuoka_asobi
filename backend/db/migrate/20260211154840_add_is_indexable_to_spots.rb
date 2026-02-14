# frozen_string_literal: true

class AddIsIndexableToSpots < ActiveRecord::Migration[8.0]
  def up
    add_column :spots, :is_indexable, :boolean, null: false, default: true
  end

  def down
    remove_column :spots, :is_indexable
  end
end
