class Contact < ApplicationRecord
  # バリデーション
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :subject, presence: true, length: { maximum: 50 }
  validates :inquiry_type, presence: true, inclusion: { in: %w[general business media error other] }
  validates :message, presence: true, length: { maximum: 500 }
  validates :privacy_policy, acceptance: true
end
