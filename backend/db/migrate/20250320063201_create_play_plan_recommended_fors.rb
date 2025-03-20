class CreatePlayPlanRecommendedFors < ActiveRecord::Migration[8.0]
  def change
    create_table :play_plan_recommended_fors do |t|
      t.integer :play_plan_id
      t.integer :recommended_for_id

      t.timestamps
    end

    add_index :play_plan_recommended_fors, :play_plan_id
    add_index :play_plan_recommended_fors, :recommended_for_id
    add_index :play_plan_recommended_fors, [:play_plan_id, :recommended_for_id], unique: true, name: 'index_play_plan_recommended_fors_unique'
  end
end
