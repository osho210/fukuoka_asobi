class SpotAmbianceRelation < ApplicationRecord
  belongs_to :spot
  belongs_to :spot_ambiance

  validates :spot_id, uniqueness: { scope: :spot_ambiance_id }
end
