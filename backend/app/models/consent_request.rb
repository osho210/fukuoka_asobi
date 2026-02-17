# frozen_string_literal: true

class ConsentRequest < ApplicationRecord
  belongs_to :spot
  has_one :consent_agreement, dependent: :destroy
  has_many :licensed_assets, through: :consent_agreement

  validates :consenter_type, presence: true, inclusion: { in: %w[STORE INSTAGRAM_USER] }
  validates :consenter_display_name, presence: true
  validates :status, presence: true, inclusion: { in: %w[DRAFT SENT APPROVED REJECTED REVOKED EXPIRED] }
  validates :token, presence: true, uniqueness: true

  before_validation :generate_token, on: :create
  before_validation :set_default_status, on: :create
  before_validation :set_default_expires_at, on: :create

  scope :active, -> { where(status: %w[DRAFT SENT]) }
  scope :approved, -> { where(status: 'APPROVED') }
  scope :for_spot, ->(spot_id) { where(spot_id: spot_id) }

  def expired?
    expires_at.present? && expires_at < Time.current
  end

  def can_be_approved?
    %w[SENT DRAFT].include?(status) && !expired?
  end

  def approve!
    update!(status: 'APPROVED')
  end

  def revoke!
    update!(status: 'REVOKED')
  end

  private

  def generate_token
    self.token ||= SecureRandom.urlsafe_base64(32)
  end

  def set_default_status
    self.status ||= 'DRAFT'
  end

  def set_default_expires_at
    self.expires_at ||= 30.days.from_now
  end
end
