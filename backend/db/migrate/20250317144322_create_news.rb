class CreateNews < ActiveRecord::Migration[8.0]
  def change
    create_table :news do |t|
      t.string :title, null: false
      t.text :body, null: false
      t.datetime :published_at
      t.integer :status, default: 0, null: false
      t.string :image_url
      t.references :author, null: true, foreign_key: { to_table: :users }
      t.references :category, null: true, foreign_key: true

      t.timestamps
    end
  end
end
