class Spot < ApplicationRecord
  belongs_to :district
  has_many :opening_hours, dependent: :destroy
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

  validates :spot_name, presence: true

  # 予算感のバリデーション
  validates :budget_range, inclusion: { in: %w(安い 普通 高い) }, allow_nil: true

  # テーマのバリデーション
  validates :theme, inclusion: { in: %w(癒しの旅 アクティブ コスパ グルメ 自然 文化と歴史) }, allow_nil: true

  # レビュー評価のバリデーション
  validates :review_rating, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }, allow_nil: true

  # スポットタイプのバリデーション
  validates :spot_type, inclusion: { in: %w(STORE TOURIST_SPOT ACTIVITY) }

  # 定休日一覧を取得
  def closed_days
    opening_hours.where(is_closed_day: true).pluck(:day_of_week)
  end

  # 営業時間を最適化して取得（同じ時間帯の曜日をまとめる）
  def opening_hour_list
    # 営業時間ごとにグループ化
    hours_by_time = {}

    opening_hours.where(is_closed_day: false).each do |hour|
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

  private

  # 曜日の範囲を整形する（例: 月,火,水,木 → 月 - 木）
  def format_day_range(days)
    return days.first if days.size == 1

    # 曜日の順序を定義
    day_order = %w(月 火 水 木 金 土 日)
    sorted_days = days.sort_by { |day| day_order.index(day) }

    # 連続した曜日をグループ化
    ranges = []
    current_range = [sorted_days.first]

    (1...sorted_days.size).each do |i|
      prev_idx = day_order.index(sorted_days[i-1])
      curr_idx = day_order.index(sorted_days[i])

      if curr_idx == prev_idx + 1
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
