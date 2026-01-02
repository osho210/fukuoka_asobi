class DirectionCard < ApplicationRecord
  # バリデーション
  validates :text, presence: true, length: { maximum: 200 }
  validates :weight, numericality: { only_integer: true, greater_than_or_equal_to: 1 }

  # アクティブなカードのみを取得するスコープ
  scope :active, -> { where(active: true) }

  # ランダムに取得するスコープ（重み付き）
  scope :weighted_random, ->(limit = 1) {
    active.order(Arel.sql('RAND() * weight DESC')).limit(limit)
  }

  # タグを配列として取得
  def tag_array
    tags.to_s.split(',').map(&:strip).reject(&:blank?)
  end

  # タグを配列から設定
  def tag_array=(value)
    self.tags = value.join(',')
  end
end
