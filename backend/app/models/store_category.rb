class StoreCategory < ApplicationRecord
  belongs_to :store
  belongs_to :category

  validates :store_id, uniqueness: { scope: :category_id }
end
