class CreateStoreHashtags < ActiveRecord::Migration[8.0]
  def change
    create_table :store_hashtags do |t|
      t.references :store, null: false, foreign_key: true
      t.references :hashtag, null: false, foreign_key: true

      t.timestamps
    end

    add_index :store_hashtags, [:store_id, :hashtag_id], unique: true
  end
end
