class Menu < ApplicationRecord
  has_many :store_menus, dependent: :destroy
  has_many :stores, through: :store_menus

  validates :menu_name, presence: true
end
