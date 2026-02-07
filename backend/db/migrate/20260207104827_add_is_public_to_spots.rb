# frozen_string_literal: true

class AddIsPublicToSpots < ActiveRecord::Migration[8.0]
  def up
    add_column :spots, :is_public, :boolean, null: false, default: true
  end

  def down
    remove_column :spots, :is_public
  end
end
