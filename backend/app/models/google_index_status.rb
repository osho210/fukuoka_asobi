# frozen_string_literal: true

# Google Search ConsoleのURL Inspection APIから取得したインデックス状態を保持するモデル
#
# Googleのインデックス状態を表すモデル。
# Spot, PlayPlan, Event, Newsなど、インデックス対象のレコードとポリモーフィック関連を持つ。
class GoogleIndexStatus < ApplicationRecord
  # ポリモーフィック関連
  belongs_to :indexable, polymorphic: true

  # バリデーション
  validates :inspected_url, presence: true
  validates :indexable_type, presence: true
  validates :indexable_id, presence: true

  # verdict（総合判定）のENUM
  VERDICTS = %w[PASS FAIL PARTIAL NEUTRAL].freeze
  validates :verdict, inclusion: { in: VERDICTS, allow_nil: true }

  # coverage_state（カバレッジ状態）の代表的な値
  COVERAGE_STATES = [
    "Submitted and indexed", # 送信済みでインデックス済み
    "Indexed, not submitted in sitemap", # インデックス済み、サイトマップ未送信
    "Discovered - currently not indexed", # 検出済み、現在インデックスされていない
    "Crawled - currently not indexed", # クロール済み、現在インデックスされていない
    "Excluded by 'noindex' tag", # noindexタグで除外
    "Page with redirect", # リダイレクトされるページ
    "Not found (404)", # 404エラー
    "Server error (5xx)", # サーバーエラー
    "Blocked by robots.txt" # robots.txtでブロック
  ].freeze

  # ヘルパーメソッド: インデックス済みかどうか
  #
  # Returns:
  #   Boolean: インデックスされている場合 true
  def indexed?
    coverage_state&.include?("indexed") || coverage_state&.include?("Indexed")
  end

  # ヘルパーメソッド: クロール済みかどうか
  #
  # Returns:
  #   Boolean: クロールされている場合 true
  def crawled?
    last_crawl_time.present?
  end

  # ヘルパーメソッド: インデックス可能かどうか
  #
  # Returns:
  #   Boolean: インデックス許可されている場合 true
  def indexable?
    indexing_allowed == true
  end

  # ヘルパーメソッド: インデックスされていない理由を取得
  #
  # Returns:
  #   String: インデックスされていない理由
  def not_indexed_reason
    return nil if indexed?
    
    coverage_state || "不明"
  end

  # ヘルパーメソッド: 設定と実状態の不一致を検出
  # 想定: indexableレコードがis_indexable=trueかつpublishedなのにGoogleにインデックスされていない
  #
  # Returns:
  #   Boolean: 不一致がある場合 true
  def has_mismatch?
    return false unless indexable.respond_to?(:is_indexable)
    return false unless indexable.respond_to?(:published?) || indexable.respond_to?(:is_public)

    # レコードがインデックスを許可していて公開されている
    should_be_indexed = indexable.is_indexable && 
                       (indexable.respond_to?(:published?) ? indexable.published? : indexable.is_public)

    # 実際にはインデックスされていない
    !indexed? && should_be_indexed
  end

  # ヘルパーメソッド: ステータスカラー判定
  # - 緑: 設定OK & Indexed
  # - 黄: 設定OK & Not Indexed
  # - 赤: 設定NG & Indexed
  #
  # Returns:
  #   String: "green" | "yellow" | "red" | "gray"
  def status_color
    return "gray" unless indexable.respond_to?(:is_indexable)

    should_be_indexed = indexable.is_indexable && 
                       (indexable.respond_to?(:published?) ? indexable.published? : indexable.is_public)

    if should_be_indexed && indexed?
      "green"   # 設定OK & Indexed
    elsif should_be_indexed && !indexed?
      "yellow"  # 設定OK & Not Indexed
    elsif !should_be_indexed && indexed?
      "red"     # 設定NG & Indexed
    else
      "gray"    # 設定NG & Not Indexed（正常）
    end
  end
end
