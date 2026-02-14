# frozen_string_literal: true

require 'google/apis/searchconsole_v1'
require 'googleauth'

# Google Search Console APIを使用してURL Inspection APIを呼び出すサービスクラス
#
# URL Inspection APIを使用して、指定されたURLのインデックス状態を取得します。
# Service Account認証を使用してGoogle Search Console APIにアクセスします。
class GoogleSearchConsoleService
  # Google Search Console APIのクライアント
  #
  # Returns:
  #   Google::Apis::SearchconsoleV1::SearchConsoleService: APIクライアント
  def self.client
    @client ||= begin
      service = Google::Apis::SearchconsoleV1::SearchConsoleService.new
      service.authorization = authorize
      service
    end
  end

  # Service Account認証を実行
  #
  # Returns:
  #   Google::Auth::ServiceAccountCredentials: 認証情報
  def self.authorize
    # Service Accountの認証情報を取得
    credentials_json = Rails.application.credentials.google&.dig(:search_console_service_account)
    
    unless credentials_json
      raise 'Google Search Console Service Account credentials not found. ' \
            'Please configure it in Rails.application.credentials under ' \
            ':google -> :search_console_service_account. ' \
            'Refer to https://guides.rubyonrails.org/security.html#custom-credentials for setup instructions.'
    end

    # 認証情報をStringIOに変換
    credentials_io = StringIO.new(credentials_json.to_json)
    
    # Service Account認証を作成
    Google::Auth::ServiceAccountCredentials.make_creds(
      json_key_io: credentials_io,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly'
    )
  end

  # 指定されたURLのインデックス状態を取得
  #
  # Args:
  #   url (String): 検査対象のURL（完全なURL）
  #   site_url (String): Search Consoleに登録されているプロパティURL（例: https://example.com）
  #
  # Returns:
  #   Google::Apis::SearchconsoleV1::InspectUrlIndexResponse: インデックス状態のレスポンス
  #
  # Raises:
  #   Google::Apis::Error: API呼び出しエラー
  def self.inspect_url(url, site_url)
    request_body = Google::Apis::SearchconsoleV1::InspectUrlIndexRequest.new(
      inspection_url: url,
      site_url: site_url
    )

    begin
      client.inspect_url_index(request_body)
    rescue Google::Apis::Error => e
      Rails.logger.error "Google Search Console API Error: #{e.message}"
      raise
    end
  end

  # インデックス状態をデータベースに保存または更新
  #
  # Args:
  #   indexable (ActiveRecord): インデックス対象のレコード（Spot, PlayPlan, Event, News）
  #   url (String): 検査対象のURL
  #   site_url (String): Search Consoleに登録されているプロパティURL
  #
  # Returns:
  #   GoogleIndexStatus: 保存されたGoogleIndexStatusレコード
  def self.update_index_status(indexable, url, site_url)
    response = inspect_url(url, site_url)
    
    # レスポンスから必要な情報を抽出
    index_status_result = response.inspection_result&.index_status_result
    mobile_usability_result = response.inspection_result&.mobile_usability_result
    rich_results_result = response.inspection_result&.rich_results_result

    # GoogleIndexStatusレコードを作成または更新
    google_status = indexable.google_index_status || indexable.build_google_index_status
    
    google_status.assign_attributes(
      inspected_url: url,
      inspection_result_link: response.inspection_result&.inspection_result_link,
      
      # インデックス状態
      coverage_state: index_status_result&.coverage_state,
      crawled_as: index_status_result&.crawled_as,
      indexing_allowed: parse_indexing_state(index_status_result&.indexing_state),
      last_crawl_time: index_status_result&.last_crawl_time,
      
      # ページフェッチ状態
      page_fetch_state: index_status_result&.page_fetch_state,
      
      # 総合判定
      verdict: index_status_result&.verdict,
      
      # カノニカルURL
      google_canonical: index_status_result&.google_canonical,
      user_canonical: index_status_result&.user_canonical,
      
      # リッチリザルト
      rich_results_items: extract_rich_results(rich_results_result),
      
      # モバイルユーザビリティ
      mobile_friendly_verdict: mobile_usability_result&.verdict,
      mobile_friendly_issues: extract_mobile_issues(mobile_usability_result),
      
      # 生レスポンス（デバッグ用）
      raw_response: response.to_h
    )

    google_status.save!
    google_status
  rescue Google::Apis::Error => e
    Rails.logger.error "Failed to update Google index status: #{e.message}"
    raise
  end

  # indexing_stateをbooleanに変換
  #
  # Args:
  #   indexing_state (String): インデックス許可状態
  #
  # Returns:
  #   Boolean: インデックス許可されている場合 true
  def self.parse_indexing_state(indexing_state)
    indexing_state == 'INDEXING_ALLOWED'
  end

  # リッチリザルト情報を抽出
  #
  # Args:
  #   rich_results_result: リッチリザルト結果オブジェクト
  #
  # Returns:
  #   Array<Hash>: リッチリザルト情報の配列
  def self.extract_rich_results(rich_results_result)
    return nil unless rich_results_result&.detected_items

    rich_results_result.detected_items.map do |item|
      {
        type: item.rich_result_type,
        items: item.items&.map { |i| { name: i.name, issues: i.issues&.map(&:severity) } }
      }
    end
  end

  # モバイルユーザビリティの問題を抽出
  #
  # Args:
  #   mobile_usability_result: モバイルユーザビリティ結果オブジェクト
  #
  # Returns:
  #   Array<Hash>: モバイルユーザビリティ問題の配列
  def self.extract_mobile_issues(mobile_usability_result)
    return nil unless mobile_usability_result&.issues

    mobile_usability_result.issues.map do |issue|
      {
        issue_type: issue.issue_type,
        severity: issue.severity,
        message: issue.message
      }
    end
  end
end
