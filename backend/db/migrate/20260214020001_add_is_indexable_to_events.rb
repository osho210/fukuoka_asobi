# frozen_string_literal: true

class AddIsIndexableToEvents < ActiveRecord::Migration[8.0]
  def up
    add_column :events, :is_indexable, :boolean, null: false, default: true
  end

  def down
    remove_column :events, :is_indexable
  end
end
