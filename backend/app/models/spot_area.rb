class SpotArea < ApplicationRecord
  belongs_to :spot
  belongs_to :area

  validates :spot_id, uniqueness: { scope: :area_id }
end
