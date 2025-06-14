class Station < ApplicationRecord
  validates :name, presence: true, uniqueness: true

  # IDまたはslugでエリアを検索するメソッド
  def self.find_by_id_or_slug(identifier)
    # 数値IDの場合
    return find(identifier) if identifier.is_a?(Integer) || identifier.to_i.to_s == identifier.to_s

    # 文字列（slug）の場合
    find_by(slug: identifier)
  end
end