class ExperienceCard < ApplicationRecord
  # バリデーション
  validates :title, presence: true, length: { maximum: 100 }
  validates :body, length: { maximum: 500 }, allow_blank: true
  validates :duration, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true

  # アクティブなカードのみを取得するスコープ
  scope :active, -> { where(active: true) }

  # タグで絞り込むスコープ
  scope :by_tags, ->(tag_array) {
    return active if tag_array.blank?

    tag_conditions = tag_array.map { |tag| "FIND_IN_SET(?, tags) > 0" }.join(' OR ')
    active.where(tag_conditions, *tag_array)
  }

  # タグの一致数でソートするスコープ
  scope :order_by_tag_matches, ->(tag_array) {
    return active if tag_array.blank?

    # タグの一致数を計算してソート
    sanitized_tags = tag_array.map { |tag| ActiveRecord::Base.connection.quote(tag) }
    select_clause = "experience_cards.*, (#{
      sanitized_tags.map { |tag| "FIND_IN_SET(#{tag}, tags) > 0" }.join(' + ')
    }) as tag_match_count"

    select(Arel.sql(select_clause)).order(Arel.sql('tag_match_count DESC, RAND()'))
  }

  # タグを配列として取得
  def tag_array
    tags.to_s.split(',').map(&:strip).reject(&:blank?)
  end

  # タグを配列から設定
  def tag_array=(value)
    self.tags = value.join(',')
  end

  # 本文を省略形式で取得（デフォルト100文字）
  def truncated_body(length = 100)
    return '' if body.blank?

    body.length > length ? "#{body[0...length]}..." : body
  end
end
