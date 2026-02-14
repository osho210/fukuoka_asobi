module Resolvers
  class SeoIndexListResolver < Resolvers::BaseResolver
    type [Types::SeoIndexRowType], null: false

    argument :type, String, required: false, description: "フィルタ対象のレコード種別 (spot | plan | event | news)"
    argument :is_indexable, Boolean, required: false, description: "is_indexableでフィルタ"
    argument :status, Types::StatusEnumType, required: false, description: "ステータスでフィルタ"

    # SEOインデックス状態の一覧を取得します。
    #
    # Args:
    #   type (String): フィルタ対象のレコード種別
    #   is_indexable (Boolean): インデックス可否でフィルタ
    #   status (StatusEnumType): ステータスでフィルタ
    #
    # Returns:
    #   Array<SeoIndexRow>: SEOインデックス情報の配列
    def resolve(type: nil, is_indexable: nil, status: nil)
      records = []

      # spots を取得
      if type.nil? || type == "spot"
        records += fetch_spots(is_indexable, status)
      end

      # play_plans を取得
      if type.nil? || type == "plan"
        records += fetch_plans(is_indexable, status)
      end

      # events を取得
      if type.nil? || type == "event"
        records += fetch_events(is_indexable, status)
      end

      # news を取得
      if type.nil? || type == "news"
        records += fetch_news(is_indexable, status)
      end

      # updated_at でソート
      records.sort
    end

    private

    def frontend_base_url
      # 環境変数から取得、デフォルトはローカル開発用
      ENV.fetch("FRONTEND_URL", "http://localhost:8200")
    end

    # スポット情報を取得
    def fetch_spots(is_indexable, status)
      spots = Spot.includes(:google_index_status).all
      spots = spots.where(is_indexable: is_indexable) unless is_indexable.nil?
      spots = spots.where(is_public: map_status_to_public(status)) unless status.nil?
      
      spots.order(updated_at: :desc).map do |spot|
        SeoIndexRow.new(spot, "spot", "#{frontend_base_url}/spots/#{spot.id}")
      end
    end

    # プラン情報を取得
    def fetch_plans(is_indexable, status)
      plans = PlayPlan.includes(:google_index_status).all
      plans = plans.where(is_indexable: is_indexable) unless is_indexable.nil?
      plans = plans.where(is_public: map_status_to_public(status)) unless status.nil?
      
      plans.order(updated_at: :desc).map do |plan|
        SeoIndexRow.new(plan, "plan", "#{frontend_base_url}/play_plans/#{plan.id}")
      end
    end

    # イベント情報を取得
    def fetch_events(is_indexable, status)
      events = Event.includes(:google_index_status).all
      events = events.where(is_indexable: is_indexable) unless is_indexable.nil?
      events = events.where(status: map_status_to_string(status)) unless status.nil?
      
      events.order(updated_at: :desc).map do |event|
        SeoIndexRow.new(event, "event", "#{frontend_base_url}/events/#{event.id}")
      end
    end

    # ニュース情報を取得
    def fetch_news(is_indexable, status)
      news = News.includes(:google_index_status).all
      news = news.where(is_indexable: is_indexable) unless is_indexable.nil?
      news = news.where(status: map_status_to_string(status)) unless status.nil?
      
      news.order(updated_at: :desc).map do |news_item|
        SeoIndexRow.new(news_item, "news", "#{frontend_base_url}/news/#{news_item.id}")
      end
    end

    # GraphQL Enumをis_publicのboolean値にマッピング
    def map_status_to_public(status)
      return nil if status.nil?
      
      case status
      when "published"
        true
      when "draft"
        false
      else
        nil
      end
    end

    # GraphQL Enumをstatus文字列にマッピング
    def map_status_to_string(status)
      return nil if status.nil?
      status.to_s
    end
  end
end
