class CreateGoogleIndexStatuses < ActiveRecord::Migration[8.0]
  def change
    create_table :google_index_statuses do |t|
      # ポリモーフィック関連
      t.references :indexable, polymorphic: true, null: false

      # Google URL Inspection APIから取得した情報
      t.string :inspection_result_link, comment: "検証結果のURL"
      
      # インデックス状態
      t.string :coverage_state, comment: "カバレッジ状態（Submitted and indexed, etc.）"
      t.string :crawled_as, comment: "クロール方法（MOBILE, DESKTOP）"
      t.boolean :indexing_allowed, comment: "インデックス許可されているか（robots.txtなど）"
      t.datetime :last_crawl_time, comment: "最終クロール日時"
      
      # ページフェッチ状態
      t.string :page_fetch_state, comment: "ページ取得状態（Successful, etc.）"
      
      # インデックス状態の判定
      t.string :verdict, comment: "総合判定（PASS, FAIL, PARTIAL, NEUTRAL）"
      
      # Googleによるカノニカル
      t.string :google_canonical, comment: "Googleが認識しているカノニカルURL"
      
      # ユーザー指定カノニカル
      t.string :user_canonical, comment: "ユーザーが指定したカノニカルURL"
      
      # リッチリザルト
      t.json :rich_results_items, comment: "リッチリザルト情報（JSON）"
      
      # モバイルユーザビリティ
      t.string :mobile_friendly_verdict, comment: "モバイルフレンドリー判定"
      t.json :mobile_friendly_issues, comment: "モバイルユーザビリティの問題（JSON）"

      # 参照URL（どのURLで検査したか）
      t.string :inspected_url, null: false, comment: "検査対象URL"

      # API生レスポンス（デバッグ用）
      t.json :raw_response, comment: "API生レスポンス（JSON）"

      t.timestamps
    end

    # インデックス検索の高速化
    add_index :google_index_statuses, [:indexable_type, :indexable_id], name: 'index_google_statuses_on_indexable'
    add_index :google_index_statuses, :inspected_url
    add_index :google_index_statuses, :coverage_state
    add_index :google_index_statuses, :last_crawl_time
  end
end
