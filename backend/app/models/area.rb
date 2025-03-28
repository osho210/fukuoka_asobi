class Area < ApplicationRecord
  belongs_to :district
  has_many :spot_areas, dependent: :destroy
  has_many :spots, through: :spot_areas

  validates :area_name, presence: true
  validates :area_name, uniqueness: { scope: :district_id }
  validates :slug, uniqueness: true, allow_nil: true

  # slugでエリアを検索するスコープ
  scope :with_slug, ->(slug) { where(slug: slug) }

  # IDまたはslugでエリアを検索するメソッド
  def self.find_by_id_or_slug(identifier)
    # 数値IDの場合
    return find(identifier) if identifier.is_a?(Integer) || identifier.to_i.to_s == identifier.to_s

    # 文字列（slug）の場合
    find_by(slug: identifier)
  end
end
