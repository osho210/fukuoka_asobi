class AddIsRecommendedToPlayPlans < ActiveRecord::Migration[8.0]
  def change
    add_column :play_plans, :is_recommended, :boolean, default: false, null: false, comment: '編集部おすすめフラグ'
    add_index :play_plans, :is_recommended
  end
end
