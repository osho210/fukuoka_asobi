class AccessibilityOption < ApplicationRecord
  has_many :spot_accessibility_options, dependent: :destroy
  has_many :spots, through: :spot_accessibility_options

  validates :name, presence: true, uniqueness: true
end
