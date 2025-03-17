class Event < ApplicationRecord
  belongs_to :event_category

  enum :status, { draft: 0, published: 1, canceled: 2 }

  validates :title, presence: true
  validates :description, presence: true
  validates :location, presence: true
  validates :start_datetime, presence: true
  validates :end_datetime, presence: true
  validates :status, presence: true

  validate :end_datetime_after_start_datetime

  scope :upcoming, -> { where('start_datetime > ?', Time.current).order(start_datetime: :asc) }
  scope :past, -> { where('end_datetime < ?', Time.current).order(start_datetime: :desc) }
  scope :published, -> { where(status: :published) }

  private

  def end_datetime_after_start_datetime
    return if end_datetime.blank? || start_datetime.blank?

    if end_datetime < start_datetime
      errors.add(:end_datetime, "はイベント開始日時より後の日時を設定してください")
    end
  end
end
