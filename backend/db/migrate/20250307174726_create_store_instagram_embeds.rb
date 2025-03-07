class CreateStoreInstagramEmbeds < ActiveRecord::Migration[8.0]
  def change
    create_table :store_instagram_embeds do |t|
      t.references :store, null: false, foreign_key: true
      t.references :instagram_embed, null: false, foreign_key: true

      t.timestamps
    end

    add_index :store_instagram_embeds, [:store_id, :instagram_embed_id], unique: true, name: 'index_store_instagram_embeds_on_store_and_instagram_embed'
  end
end
