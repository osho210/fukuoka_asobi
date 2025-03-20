class PlayPlanRecommendedFor < ApplicationRecord
  belongs_to :play_plan
  belongs_to :recommended_for

  validates :play_plan_id, uniqueness: { scope: :recommended_for_id }
end
