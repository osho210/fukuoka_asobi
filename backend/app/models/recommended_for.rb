class RecommendedFor < ApplicationRecord
  has_many :play_plan_recommended_fors, dependent: :destroy
  has_many :play_plans, through: :play_plan_recommended_fors

  validates :name, presence: true, uniqueness: true
end
