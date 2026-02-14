# frozen_string_literal: true

module Mutations
  class UpdateGoogleIndexStatus < Mutations::BaseMutation
    description "Google Search Console APIを使用してインデックス状態を更新します"

    # 入力パラメータ
    argument :indexable_type, String, required: true, description: "レコード種別（Spot, PlayPlan, Event, News）"
    argument :indexable_id, ID, required: true, description: "レコードID"
    argument :site_url, String, required: false, description: "Search Consoleプロパティ URL（省略時は環境変数から取得）"

    # 戻り値
    field :google_index_status, Types::GoogleIndexStatusType, null: true, description: "更新されたGoogleインデックス状態"
    field :errors, [String], null: false, description: "エラーメッセージ"

    # Mutationの実行
    #
    # Args:
    #   indexable_type (String): レコード種別
    #   indexable_id (ID): レコードID
    #   site_url (String): Search ConsoleプロパティURL
    #
    # Returns:
    #   Hash: google_index_status と errors を含むハッシュ
    def resolve(indexable_type:, indexable_id:, site_url: nil)
      # レコード種別のバリデーション
      allowed_types = %w[Spot PlayPlan Event News]
      unless allowed_types.include?(indexable_type)
        return {
          google_index_status: nil,
          errors: ["無効なレコード種別です。許可されている種別: #{allowed_types.join(', ')}"]
        }
      end

      # レコードを取得
      indexable = indexable_type.constantize.find_by(id: indexable_id)
      unless indexable
        return {
          google_index_status: nil,
          errors: ["#{indexable_type} ID=#{indexable_id} が見つかりません"]
        }
      end

      # URLを構築
      url = build_url(indexable_type, indexable_id)
      
      # site_urlが指定されていない場合は環境変数から取得
      site_url ||= ENV.fetch("GOOGLE_SEARCH_CONSOLE_SITE_URL", "https://fukuoka-asobi.com")

      # Google Search Console APIを呼び出してインデックス状態を更新
      begin
        google_status = GoogleSearchConsoleService.update_index_status(indexable, url, site_url)
        
        {
          google_index_status: google_status,
          errors: []
        }
      rescue GoogleSearchConsoleService::MissingCredentialsError => e
        Rails.logger.error "Google Search Console Credentials Error: #{e.message}"
        {
          google_index_status: nil,
          errors: ["認証情報が設定されていません。管理者にお問い合わせください。"]
        }
      rescue Google::Apis::Error => e
        Rails.logger.error "Google Search Console API Error: #{e.message}"
        {
          google_index_status: nil,
          errors: ["Google Search Console APIエラー: #{e.message}"]
        }
      rescue StandardError => e
        Rails.logger.error "Unexpected error: #{e.message}"
        {
          google_index_status: nil,
          errors: ["予期しないエラーが発生しました: #{e.message}"]
        }
      end
    end

    private

    # URLを構築
    #
    # Args:
    #   indexable_type (String): レコード種別
    #   indexable_id (ID): レコードID
    #
    # Returns:
    #   String: フロントエンドのURL
    def build_url(indexable_type, indexable_id)
      base_url = ENV.fetch("FRONTEND_URL", "http://localhost:8200")
      
      case indexable_type
      when "Spot"
        "#{base_url}/spots/#{indexable_id}"
      when "PlayPlan"
        "#{base_url}/play_plans/#{indexable_id}"
      when "Event"
        "#{base_url}/events/#{indexable_id}"
      when "News"
        "#{base_url}/news/#{indexable_id}"
      else
        base_url
      end
    end
  end
end
