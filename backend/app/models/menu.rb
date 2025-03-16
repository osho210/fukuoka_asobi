class Menu < ApplicationRecord
  has_many :spot_menus, dependent: :destroy
  has_many :spots, through: :spot_menus

  validates :menu_name, presence: true
end
