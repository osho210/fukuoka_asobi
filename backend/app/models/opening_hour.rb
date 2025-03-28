class OpeningHour < ApplicationRecord
  belongs_to :spot

  validates :day_of_week, presence: true
  validates :day_of_week, uniqueness: { scope: :spot_id }
  validates :day_of_week, inclusion: { in: %w(mon tue wed thu fri sat sun) }
  validates :open_time, presence: true, unless: :is_closed_day
  validates :close_time, presence: true, unless: :is_closed_day

  validate :close_time_after_open_time, unless: :is_closed_day

  private

  def close_time_after_open_time
    return if open_time.blank? || close_time.blank?

    if close_time <= open_time
      errors.add(:close_time, "は開店時間より後である必要があります")
    end
  end
end
