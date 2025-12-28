class CreateBucketListItems < ActiveRecord::Migration[8.0]
  def change
    create_table :bucket_list_items do |t|
      t.references :layout_bucket, null: false, foreign_key: { on_delete: :restrict }

      t.string :title, null: false, limit: 255
      t.text :content

      t.string :area_text, limit: 255, comment: '抽象的なエリア名（例：福岡タワー周辺）'

      t.string :meeting_place_name, limit: 255
      t.string :meeting_place_address, limit: 255
      t.string :meeting_place_google_place_id, limit: 128

      t.integer :stay_minutes, comment: '滞在時間（分）'
      t.datetime :meeting_time
      t.datetime :start_time
      t.datetime :end_time

      t.integer :cost_min, comment: '最小費用（円）'
      t.integer :cost_max, comment: '最大費用（円）'

      t.string :weather, null: false, default: 'any', limit: 32, comment: '推奨天気（any, sunny, cloudy, rainy, snowy）'

      t.string :status, null: false, default: 'draft', limit: 32, comment: 'ステータス（draft, published, archived）'
      t.datetime :published_at

      t.timestamps
    end
  end
end
