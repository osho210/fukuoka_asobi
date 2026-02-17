# frozen_string_literal: true

class AddIsPublicToPlayPlans < ActiveRecord::Migration[8.0]
  def up
    add_column :play_plans, :is_public, :boolean, default: false, null: false, comment: "公開フラグ"
    add_index :play_plans, :is_public

    # 既存のpublishedステータスのレコードをis_public=trueに更新
    execute <<-SQL
      UPDATE play_plans
      SET is_public = true
      WHERE status = 1
    SQL
  end

  def down
    remove_index :play_plans, :is_public
    remove_column :play_plans, :is_public
  end
end