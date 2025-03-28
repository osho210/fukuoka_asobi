class District < ApplicationRecord
  has_many :areas, dependent: :destroy
  has_many :spots, dependent: :restrict_with_error

  validates :district_name, presence: true, uniqueness: true
  validates :slug, uniqueness: true, allow_nil: true

  # slugでdistrictを検索するスコープ
  scope :with_slug, ->(slug) { where(slug: slug) }

  # IDまたはslugでdistrictを検索するメソッド
  def self.find_by_id_or_slug(identifier)
    # 数値IDの場合
    return find(identifier) if identifier.is_a?(Integer) || identifier.to_i.to_s == identifier.to_s

    # 文字列（slug）の場合
    find_by(slug: identifier)
  end
end
