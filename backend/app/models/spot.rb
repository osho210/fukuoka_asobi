class Spot < ApplicationRecord
  has_many :spot_magazines, dependent: :destroy
  has_many :magazines, through: :spot_magazines
  accepts_nested_attributes_for :spot_magazines, allow_destroy: true
  belongs_to :district
  has_many :opening_hours, dependent: :destroy
  accepts_nested_attributes_for :opening_hours, allow_destroy: true
  has_many :spot_areas, dependent: :destroy
  has_many :areas, through: :spot_areas
  has_many :spot_categories, dependent: :destroy
  has_many :categories, through: :spot_categories
  has_many :spot_hashtags, dependent: :destroy
  has_many :hashtags, through: :spot_hashtags
  has_many :spot_instagram_embeds, dependent: :destroy
  has_many :instagram_embeds, through: :spot_instagram_embeds
  has_many :spot_menus, dependent: :destroy
  has_many :menus, through: :spot_menus
  has_many :spot_ambiance_relations, dependent: :destroy
  has_many :spot_ambiances, through: :spot_ambiance_relations
  has_many :spot_purposes, dependent: :destroy
  has_many :purposes, through: :spot_purposes

  # Google Places API関連の関連付け
  has_many :spot_photos, dependent: :destroy
  has_many :spot_accessibility_options, dependent: :destroy
  has_many :accessibility_options, through: :spot_accessibility_options

  validates :spot_name, presence: true

  # 予算感のバリデーション
  validates :budget_range, inclusion: { in: %w(CHEAP AVERAGE EXPENSIVE) }, allow_nil: true

  # テーマのバリデーション
  validates :theme, inclusion: { in: %w(癒しの旅 アクティブ コスパ グルメ 自然 文化と歴史) }, allow_nil: true

  # レビュー評価のバリデーション
  validates :review_rating, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }, allow_nil: true

  # スポットタイプのバリデーション
  validates :spot_type, inclusion: { in: %w(STORE TOURIST_SPOT ACTIVITY) }

  # Google Places API関連のENUM定義
  enum :business_status, {
    unspecified:         0,  # BUSINESS_STATUS_UNSPECIFIED
    operational:         1,  # OPERATIONAL
    closed_temporarily:  2,  # CLOSED_TEMPORARILY
    closed_permanently:  3   # CLOSED_PERMANENTLY
  }, prefix: :business_status

  enum :price_level, {
    unspecified:        0,  # PRICE_LEVEL_UNSPECIFIED
    free:               1,  # PRICE_LEVEL_FREE
    inexpensive:        2,  # PRICE_LEVEL_INEXPENSIVE
    moderate:           3,  # PRICE_LEVEL_MODERATE
    expensive:          4,  # PRICE_LEVEL_EXPENSIVE
    very_expensive:     5   # PRICE_LEVEL_VERY_EXPENSIVE
  }, prefix: :price_level

  # 定休日一覧を取得
  def closed_days
    opening_hours.where(is_closed_day: true).pluck(:day_of_week)
  end

  # 営業時間を最適化して取得（同じ時間帯の曜日をまとめる）
  def opening_hour_list
    # 営業時間ごとにグループ化
    hours_by_time = {}

    opening_hours.where(is_closed_day: false).each do |hour|
      next unless hour.open_time && hour.close_time && hour.day_of_week
      business_hour = hour.open_time.strftime('%H:%M') + ' ~ ' + hour.close_time.strftime('%H:%M')
      hours_by_time[business_hour] ||= []
      hours_by_time[business_hour] << hour.day_of_week
    end

    # 定休日を追加
    closed = closed_days
    if closed.present?
      hours_by_time['定休日'] = closed
    end

    # 結果を整形
    hours_by_time.map do |time, days|
      {
        day_of_week: format_day_range(days),
        business_hour: time
      }
    end
  end

  # おすすめ対象を取得
  def recommended_fors
    recommended_for_names = [recommended_for_1, recommended_for_2].compact
    RecommendedFor.where(name: recommended_for_names)
  end

  # 価格帯情報を取得するメソッド
  def price_range
    return nil unless price_range_start_amount && price_range_end_amount

    {
      start_price: {
        amount: price_range_start_amount,
      },
      end_price: {
        amount: price_range_end_amount,
      }
    }
  end

  # レビューサマリー情報を取得するメソッド
  def review_summary
    return nil unless review_summary_text

    {
      text: review_summary_text,
      flag_content_uri: review_summary_flag_content_uri,
      disclosure_text: review_summary_disclosure_text,
      reviews_uri: review_summary_reviews_uri
    }
  end

  # 決済オプション情報を取得するメソッド
  def payment_options
    {
      accepts_credit_cards: accepts_credit_cards,
      accepts_debit_cards: accepts_debit_cards,
      accepts_cash_only: accepts_cash_only,
      accepts_nfc: accepts_nfc
    }
  end

  # 駐車場オプション情報を取得するメソッド
  def parking_options
    {
      free_parking_lot: free_parking_lot,
      paid_parking_lot: paid_parking_lot,
      free_street_parking: free_street_parking,
      paid_street_parking: paid_street_parking,
      valet_parking: valet_parking,
      free_garage_parking: free_garage_parking,
      paid_garage_parking: paid_garage_parking
    }
  end

  # Google Typesを配列として取得
  def google_types_array
    return [] unless google_types
    JSON.parse(google_types)
  rescue JSON::ParserError
    []
  end

  # Google Typesを設定
  def google_types_array=(types)
    self.google_types = types.to_json
  end

  private

  # 曜日の範囲を整形する（例: 月,火,水,木 → 月 - 木）
  def format_day_range(days)
    return '' if days.blank?

    # nilを除去し、日付順に並び替え
    day_order = %w(月 火 水 木 金 土 日)
    sorted_days = days.sort_by { |day| day_order.index(day) || 99 }
    return '' if sorted_days.empty?
    # 連続した曜日をグループ化
    ranges = []
    current_range = [sorted_days.first]

    (1...sorted_days.size).each do |i|
      prev_idx = day_order.index(sorted_days[i - 1])
      curr_idx = day_order.index(sorted_days[i])

      if prev_idx && curr_idx && curr_idx == prev_idx + 1
        current_range << sorted_days[i]
      else
        ranges << current_range
        current_range = [sorted_days[i]]
      end
    end
    ranges << current_range

    # 範囲を文字列に変換
    ranges.map do |range|
      if range.size >= 3
        "#{range.first} - #{range.last}"
      else
        range.join('・')
      end
    end.join('、')
  end
end
