class SpotCategory < ApplicationRecord
  belongs_to :spot
  belongs_to :category

  validates :spot_id, uniqueness: { scope: :category_id }
end
