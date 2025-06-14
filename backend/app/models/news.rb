class News < ApplicationRecord
  belongs_to :author, class_name: 'User', optional: true
  belongs_to :category, optional: true

  validates :title, presence: true
  validates :body, presence: true
  validates :status, presence: true

  scope :published, -> { where(status: :published).where('published_at <= ?', Time.current) }
  scope :recent, -> { order(published_at: :desc) }
  scope :by_category, ->(category_id) { where(category_id: category_id) if category_id.present? }
end
