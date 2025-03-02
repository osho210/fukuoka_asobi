class CreateCategories < ActiveRecord::Migration[8.0]
  def up
    create_table :categories do |t|
      t.string :name, null: false

      t.timestamps
    end
    # 一意制約の追加
    add_index :categories, :name, unique: true
  end

  def down
    # 一意インデックスの削除
    remove_index :categories, :name

    drop_table :categories
  end
end
