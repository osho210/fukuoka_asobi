class CreateFavorites < ActiveRecord::Migration[7.0]
  def change
    create_table :favorites do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.references :play_plan, null: false, foreign_key: { on_delete: :cascade }
      t.timestamps
    end

    # 同一ユーザーが同一プランを重複登録できないようにユニーク制約を追加
    add_index :favorites, [:user_id, :play_plan_id], unique: true
  end
end
