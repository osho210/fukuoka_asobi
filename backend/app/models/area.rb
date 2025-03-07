class Area < ApplicationRecord
  belongs_to :district
  has_many :store_areas, dependent: :destroy
  has_many :stores, through: :store_areas

  validates :area_name, presence: true
  validates :area_name, uniqueness: { scope: :district_id }
end
