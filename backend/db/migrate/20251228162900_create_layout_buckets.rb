class CreateLayoutBuckets < ActiveRecord::Migration[8.0]
  def change
    create_table :layout_buckets do |t|
      t.string :key, null: false, limit: 64
      t.string :name, null: false, limit: 128

      t.string :template_key, null: false, limit: 64, comment: 'テンプレート識別子（例：card, magazine, feature）'
      t.string :theme_key, null: false, default: 'default', limit: 32, comment: 'テーマ識別子（例：default, warm, cool）'

      t.string :shift, null: false, default: 'none', limit: 32, comment: 'ズレ方向（none, up, down, left, right）'
      t.string :tilt, null: false, default: 'none', limit: 32, comment: '傾き（none, cw, ccw）'
      t.string :depth, null: false, default: 'flat', limit: 32, comment: '奥行き表現（flat, lift）'

      t.string :status, null: false, default: 'active', limit: 32, comment: 'ステータス（active, inactive）'
      t.integer :sort_order, null: false, default: 0

      t.timestamps
    end

    add_index :layout_buckets, :key, unique: true
  end
end
