# frozen_string_literal: true

class AddIsIndexableToPlayPlans < ActiveRecord::Migration[8.0]
  def up
    add_column :play_plans, :is_indexable, :boolean, null: false, default: false, comment: '検索エンジンにインデックスさせるかどうか'
  end

  def down
    remove_column :play_plans, :is_indexable
  end
end
