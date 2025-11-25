class PaymentTransaction < ApplicationRecord
  belongs_to :user

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :currency, presence: true
  validates :status, presence: true

  # ステータスの定義
  enum status: {
    pending: 'pending',
    succeeded: 'succeeded',
    failed: 'failed',
    canceled: 'canceled'
  }

  scope :recent, -> { order(created_at: :desc) }
  scope :by_user, ->(user_id) { where(user_id: user_id) }
end
