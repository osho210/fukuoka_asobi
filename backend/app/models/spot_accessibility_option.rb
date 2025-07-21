class SpotAccessibilityOption < ApplicationRecord
  belongs_to :spot
  belongs_to :accessibility_option

  validates :spot_id, uniqueness: { scope: :accessibility_option_id }
end
