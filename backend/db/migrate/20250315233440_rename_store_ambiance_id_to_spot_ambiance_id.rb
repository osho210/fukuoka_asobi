class RenameStoreAmbianceIdToSpotAmbianceId < ActiveRecord::Migration[8.0]
  def change
    rename_column :spot_ambiance_relations, :store_ambiance_id, :spot_ambiance_id
  end
end
