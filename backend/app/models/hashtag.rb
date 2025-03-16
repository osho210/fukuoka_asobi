class Hashtag < ApplicationRecord
  has_many :spot_hashtags, dependent: :destroy
  has_many :spots, through: :spot_hashtags

  validates :hashtag_name, presence: true, uniqueness: true
end
