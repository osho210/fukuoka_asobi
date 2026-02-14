# frozen_string_literal: true

class AddIsPublicToPlayPlans < ActiveRecord::Migration[8.0]
  def up
    add_column :play_plans, :is_public, :boolean, null: false, default: false
    
    # 既存のpublishedステータスのレコードをis_public=trueに更新
    execute <<-SQL
      UPDATE play_plans SET is_public = true WHERE status = 1
    SQL
  end

  def down
    remove_column :play_plans, :is_public
  end
end
