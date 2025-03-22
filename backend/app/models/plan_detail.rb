class PlanDetail < ApplicationRecord
  belongs_to :play_plan, foreign_key: :plan_id
  belongs_to :spot, optional: true
  has_many :travel_details, dependent: :destroy

  validates :step_number, presence: true
  validates :step_name, presence: true

  # ステップ番号順に並べるスコープ
  scope :ordered, -> { order(step_number: :asc) }
end
