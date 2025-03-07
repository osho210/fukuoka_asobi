class StoreAmbianceRelation < ApplicationRecord
  belongs_to :store
  belongs_to :store_ambiance

  validates :store_id, uniqueness: { scope: :store_ambiance_id }
end
