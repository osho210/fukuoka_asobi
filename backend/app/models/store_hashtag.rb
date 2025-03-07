class StoreHashtag < ApplicationRecord
  belongs_to :store
  belongs_to :hashtag

  validates :store_id, uniqueness: { scope: :hashtag_id }
end
