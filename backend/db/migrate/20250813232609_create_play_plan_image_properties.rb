class CreatePlayPlanImageProperties < ActiveRecord::Migration[8.0]
  def change
    create_table :play_plan_image_properties do |t|
      t.references :play_plan, null: false, foreign_key: true
      t.references :attachment, null: false, foreign_key: { to_table: :active_storage_attachments }
      t.boolean :is_selected, default: false, null: false
      t.integer :position, default: 0, null: false
      t.text :comment

      t.timestamps
    end

    # 複合ユニークインデックス
    add_index :play_plan_image_properties, [:play_plan_id, :attachment_id],
              unique: true, name: 'index_play_plan_image_properties_on_plan_and_attachment'

    # パフォーマンス用インデックス
    add_index :play_plan_image_properties, :is_selected
    add_index :play_plan_image_properties, :position
  end
end
