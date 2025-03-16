class RenameStoreToSpotAndAddSpotType < ActiveRecord::Migration[8.0]
  def change
    # メインテーブルの名前変更
    rename_table :stores, :spots

    # カラム名の変更
    rename_column :spots, :store_name, :spot_name

    # spot_type カラムの追加
    add_column :spots, :spot_type, :string, default: 'STORE', null: false
    add_index :spots, :spot_type

    # 関連する中間テーブルの名前変更
    rename_table :store_areas, :spot_areas
    rename_column :spot_areas, :store_id, :spot_id

    rename_table :store_categories, :spot_categories
    rename_column :spot_categories, :store_id, :spot_id

    rename_table :store_hashtags, :spot_hashtags
    rename_column :spot_hashtags, :store_id, :spot_id

    rename_table :store_instagram_embeds, :spot_instagram_embeds
    rename_column :spot_instagram_embeds, :store_id, :spot_id

    rename_table :store_menus, :spot_menus
    rename_column :spot_menus, :store_id, :spot_id

    rename_table :store_ambiance_relations, :spot_ambiance_relations
    rename_column :spot_ambiance_relations, :store_id, :spot_id

    rename_table :store_purposes, :spot_purposes
    rename_column :spot_purposes, :store_id, :spot_id

    # opening_hours テーブルの外部キー変更
    rename_column :opening_hours, :store_id, :spot_id

    # plan_details テーブルの外部キー変更
    rename_column :plan_details, :store_id, :spot_id

    # store_ambiances テーブルの名前変更
    rename_table :store_ambiances, :spot_ambiances
  end
end
