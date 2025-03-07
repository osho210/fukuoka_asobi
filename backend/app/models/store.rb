class Store < ApplicationRecord
  belongs_to :district
  has_many :opening_hours, dependent: :destroy
  has_many :store_areas, dependent: :destroy
  has_many :areas, through: :store_areas
  has_many :store_categories, dependent: :destroy
  has_many :categories, through: :store_categories
  has_many :store_hashtags, dependent: :destroy
  has_many :hashtags, through: :store_hashtags
  has_many :store_instagram_embeds, dependent: :destroy
  has_many :instagram_embeds, through: :store_instagram_embeds
  has_many :store_menus, dependent: :destroy
  has_many :menus, through: :store_menus
  has_many :store_ambiance_relations, dependent: :destroy
  has_many :store_ambiances, through: :store_ambiance_relations
  has_many :store_purposes, dependent: :destroy
  has_many :purposes, through: :store_purposes

  validates :store_name, presence: true

  # 予算感のバリデーション
  validates :budget_range, inclusion: { in: %w(安い 普通 高い) }, allow_nil: true

  # テーマのバリデーション
  validates :theme, inclusion: { in: %w(癒しの旅 アクティブ コスパ グルメ 自然 文化と歴史) }, allow_nil: true

  # レビュー評価のバリデーション
  validates :review_rating, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }, allow_nil: true
end
