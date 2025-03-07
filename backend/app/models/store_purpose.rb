class StorePurpose < ApplicationRecord
  belongs_to :store
  belongs_to :purpose

  validates :store_id, uniqueness: { scope: :purpose_id }
end
