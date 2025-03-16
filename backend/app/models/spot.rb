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
end
