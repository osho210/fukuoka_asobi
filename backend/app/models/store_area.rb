class StoreArea < ApplicationRecord
  belongs_to :store
  belongs_to :area

  validates :store_id, uniqueness: { scope: :area_id }
end
