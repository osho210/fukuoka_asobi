class PlayPlanImageProperty < ApplicationRecord
  belongs_to :play_plan
  belongs_to :attachment, class_name: 'ActiveStorage::Attachment'

  validates :attachment_id, uniqueness: { scope: :play_plan_id }
  validates :position, presence: true, numericality: { greater_than_or_equal_to: 0 }
end
