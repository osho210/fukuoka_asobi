# frozen_string_literal: true

class ConsentAgreement < ApplicationRecord
  belongs_to :consent_request
  has_many :licensed_assets, dependent: :destroy

  validates :agreed_at, presence: true
  validates :agreement_version, presence: true
  validates :agreement_snapshot_json, presence: true
  validates :signer_name, presence: true
  validates :rights_confirmed, inclusion: { in: [true] }

  before_validation :set_agreed_at, on: :create
  before_validation :set_agreement_version, on: :create
  before_validation :set_agreement_snapshot, on: :create

  after_create :update_consent_request_status

  def agreement_snapshot
    JSON.parse(agreement_snapshot_json)
  rescue JSON::ParserError
    {}
  end

  private

  def set_agreed_at
    self.agreed_at ||= Time.current
  end

  def set_agreement_version
    self.agreement_version ||= 'v1.0'
  end

  def set_agreement_snapshot
    return if agreement_snapshot_json.present?

    snapshot = {
      media: ['Webメディア', 'Instagram（あなたのアカウント）'],
      usage_scope: ['投稿', 'ストーリーズ'],
      credits: {
        store_name: true,
        photographer_name: photographer_name.present?,
        tag_store: tag_store_requested,
        tag_photographer: tag_photographer_requested,
        tag_accounts: tag_accounts_text
      },
      modifications_allowed: true,
      modification_note: 'レイアウト都合のトリミングや文字入れを行う場合があります'
    }
    self.agreement_snapshot_json = snapshot.to_json
  end

  def update_consent_request_status
    consent_request.approve!
  end
end
