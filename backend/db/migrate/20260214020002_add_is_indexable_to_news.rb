# frozen_string_literal: true

class AddIsIndexableToNews < ActiveRecord::Migration[8.0]
  def up
    add_column :news, :is_indexable, :boolean, null: false, default: true
  end

  def down
    remove_column :news, :is_indexable
  end
end
