# frozen_string_literal: true

# バケットリスト企画
# 「福岡でやりたいこと / 企画 / 抽象テーマ」を表す主テーブル
class BucketListItem < ApplicationRecord
  belongs_to :layout_bucket
  has_many :bucket_list_item_belongings, dependent: :destroy
  has_many :bucket_list_item_references, dependent: :destroy

  # ネストされた属性を受け入れる
  accepts_nested_attributes_for :bucket_list_item_belongings, allow_destroy: true
  accepts_nested_attributes_for :bucket_list_item_references, allow_destroy: true

  # Enum定義
  enum :weather, { any: 'any', sunny: 'sunny', cloudy: 'cloudy', rainy: 'rainy', snowy: 'snowy' }, default: :any
  enum :status, { draft: 'draft', published: 'published', archived: 'archived' }, default: :draft

  # バリデーション
  validates :title, presence: true, length: { maximum: 255 }
  validates :area_text, length: { maximum: 255 }, allow_nil: true
  validates :meeting_place_name, length: { maximum: 255 }, allow_nil: true
  validates :meeting_place_address, length: { maximum: 255 }, allow_nil: true
  validates :meeting_place_google_place_id, length: { maximum: 128 }, allow_nil: true
  validates :stay_minutes, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true
  validates :cost_min, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true
  validates :cost_max, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true

  # カスタムバリデーション: cost_max は cost_min 以上である必要がある
  validate :cost_max_must_be_greater_than_or_equal_to_cost_min

  # スコープ
  scope :published, -> { where(status: :published) }
  scope :by_weather, ->(weather) { where(weather: weather) if weather.present? }

  private

  def cost_max_must_be_greater_than_or_equal_to_cost_min
    return if cost_min.nil? || cost_max.nil?
    return if cost_max >= cost_min

    errors.add(:cost_max, 'は最小費用以上である必要があります')
  end
end
