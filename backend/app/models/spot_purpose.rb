class SpotPurpose < ApplicationRecord
  belongs_to :spot
  belongs_to :purpose

  validates :spot_id, uniqueness: { scope: :purpose_id }
end
