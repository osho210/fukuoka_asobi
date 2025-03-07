class CreateStoreAmbiances < ActiveRecord::Migration[8.0]
  def change
    create_table :store_ambiances do |t|
      t.string :ambiance_name, null: false, index: { unique: true }

      t.timestamps
    end
  end
end
