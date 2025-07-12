class SpotPhoto < ApplicationRecord
  belongs_to :spot

  validates :photo_reference, presence: true, uniqueness: { scope: :spot_id }
  validates :width, :height, numericality: { greater_than: 0 }, allow_nil: true
end
