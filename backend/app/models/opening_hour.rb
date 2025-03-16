class OpeningHour < ApplicationRecord
  belongs_to :spot

  validates :day_of_week, presence: true
  validates :open_time, presence: true
  validates :close_time, presence: true
  validates :day_of_week, uniqueness: { scope: :spot_id }
  validates :day_of_week, inclusion: { in: %w(月 火 水 木 金 土 日) }

  validate :close_time_after_open_time

  private

  def close_time_after_open_time
    return if open_time.blank? || close_time.blank?

    if close_time <= open_time
      errors.add(:close_time, "は開店時間より後である必要があります")
    end
  end
end
