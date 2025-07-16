class MenuCategory < ApplicationRecord
  has_many :menus

  validates :name, presence: true, uniqueness: true
end
