class AddIsPublicToPlayPlans < ActiveRecord::Migration[8.0]
  def change
    add_column :play_plans, :is_public, :boolean, default: false, null: false, comment: "公開フラグ"
    add_index :play_plans, :is_public
  end
end
