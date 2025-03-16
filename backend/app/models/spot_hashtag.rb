class SpotHashtag < ApplicationRecord
  belongs_to :spot
  belongs_to :hashtag

  validates :spot_id, uniqueness: { scope: :hashtag_id }
end
