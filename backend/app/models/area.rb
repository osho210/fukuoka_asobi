class Area < ApplicationRecord
  belongs_to :district
  has_many :spot_areas, dependent: :destroy
  has_many :spots, through: :spot_areas

  validates :area_name, presence: true
  validates :area_name, uniqueness: { scope: :district_id }
end
