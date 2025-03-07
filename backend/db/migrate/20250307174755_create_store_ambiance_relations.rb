class CreateStoreAmbianceRelations < ActiveRecord::Migration[8.0]
  def change
    create_table :store_ambiance_relations do |t|
      t.references :store, null: false, foreign_key: true
      t.references :store_ambiance, null: false, foreign_key: true

      t.timestamps
    end

    add_index :store_ambiance_relations, [:store_id, :store_ambiance_id], unique: true, name: 'index_store_ambiance_relations_on_store_and_ambiance'
  end
end
