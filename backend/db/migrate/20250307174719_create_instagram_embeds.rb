class CreateInstagramEmbeds < ActiveRecord::Migration[8.0]
  def change
    create_table :instagram_embeds do |t|
      t.string :instagram_embed_name, null: false
      t.string :embed_code, null: false
      t.string :embed_url, null: false

      t.timestamps
    end

    add_index :instagram_embeds, :instagram_embed_name, unique: true
  end
end
