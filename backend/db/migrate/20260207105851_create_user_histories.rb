class CreateUserHistories < ActiveRecord::Migration[8.0]
  def change
    create_table :user_histories do |t|
      t.references :user, null: false, foreign_key: true
      t.references :viewable, polymorphic: true, null: false
      t.datetime :viewed_at, null: false

      t.timestamps
    end

    # ユーザーと閲覧対象のインデックス
    add_index :user_histories, [:user_id, :viewable_type, :viewable_id], name: 'index_user_histories_on_user_and_viewable'
    # 閲覧日時でソートするためのインデックス
    add_index :user_histories, :viewed_at
  end
end
