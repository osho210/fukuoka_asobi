class AddIsPublicToPlayPlans < ActiveRecord::Migration[8.0]
  def change
    add_column :play_plans, :is_public, :boolean, default: true, null: false, comment: "検索エンジンインデックス公開フラグ"
    add_index :play_plans, :is_public
  end
end
