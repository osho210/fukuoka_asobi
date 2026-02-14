# frozen_string_literal: true

module Types
  class GoogleIndexStatusType < Types::BaseObject
    description "Google Search ConsoleのURL Inspection APIから取得したインデックス状態"

    field :id, ID, null: false, description: "GoogleIndexStatusのID"
    field :inspected_url, String, null: false, description: "検査対象URL"
    field :inspection_result_link, String, null: true, description: "検証結果のURL"
    
    # インデックス状態
    field :coverage_state, String, null: true, description: "カバレッジ状態（Submitted and indexed, etc.）"
    field :crawled_as, String, null: true, description: "クロール方法（MOBILE, DESKTOP）"
    field :indexing_allowed, Boolean, null: true, description: "インデックス許可されているか（robots.txtなど）"
    field :last_crawl_time, GraphQL::Types::ISO8601DateTime, null: true, description: "最終クロール日時"
    
    # ページフェッチ状態
    field :page_fetch_state, String, null: true, description: "ページ取得状態（Successful, etc.）"
    
    # 総合判定
    field :verdict, String, null: true, description: "総合判定（PASS, FAIL, PARTIAL, NEUTRAL）"
    
    # カノニカルURL
    field :google_canonical, String, null: true, description: "Googleが認識しているカノニカルURL"
    field :user_canonical, String, null: true, description: "ユーザーが指定したカノニカルURL"
    
    # リッチリザルト
    field :rich_results_items, GraphQL::Types::JSON, null: true, description: "リッチリザルト情報（JSON）"
    
    # モバイルユーザビリティ
    field :mobile_friendly_verdict, String, null: true, description: "モバイルフレンドリー判定"
    field :mobile_friendly_issues, GraphQL::Types::JSON, null: true, description: "モバイルユーザビリティの問題（JSON）"
    
    # ヘルパーメソッド
    field :indexed, Boolean, null: false, description: "インデックス済みかどうか", method: :indexed?
    field :crawled, Boolean, null: false, description: "クロール済みかどうか", method: :crawled?
    field :indexable, Boolean, null: false, description: "インデックス可能かどうか", method: :indexable?
    field :not_indexed_reason, String, null: true, description: "インデックスされていない理由"
    field :has_mismatch, Boolean, null: false, description: "設定と実状態の不一致があるか", method: :has_mismatch?
    field :status_color, String, null: false, description: "ステータスカラー（green, yellow, red, gray）"
    
    # タイムスタンプ
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false, description: "作成日時"
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false, description: "更新日時"
  end
end
