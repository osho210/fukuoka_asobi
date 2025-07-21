class OpeningHour < ApplicationRecord
  belongs_to :spot

  validates :day_of_week, presence: true, inclusion: { in: %w(月 火 水 木 金 土 日) }
  validates :open_time, presence: true, unless: :is_closed_day
  validates :open_time, uniqueness: { scope: [:spot_id, :day_of_week], message: "は同じ曜日に重複して登録できません" }, unless: :is_closed_day
  validates :close_time, presence: true, unless: :is_closed_day

  validate :close_time_after_open_time, unless: :is_closed_day

  private

  def close_time_after_open_time
    return if open_time.blank? || close_time.blank?
  end
end
