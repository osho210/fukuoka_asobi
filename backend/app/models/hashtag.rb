class Hashtag < ApplicationRecord
  has_many :store_hashtags, dependent: :destroy
  has_many :stores, through: :store_hashtags

  validates :hashtag_name, presence: true, uniqueness: true
end
