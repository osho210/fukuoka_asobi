# frozen_string_literal: true

class LicensedAsset < ApplicationRecord
  belongs_to :spot
  belongs_to :consent_agreement
  has_one_attached :asset_file

  validates :asset_type, presence: true, inclusion: { in: %w[UPLOAD URL] }
  validates :asset_url, presence: true, if: -> { asset_type == 'URL' }
  validate :asset_presence

  scope :usable, -> { where(usable: true) }
  scope :for_spot, ->(spot_id) { where(spot_id: spot_id) }

  def asset_presence
    if asset_type == 'UPLOAD' && !asset_file.attached?
      errors.add(:asset_file, 'must be attached when asset_type is UPLOAD')
    end
  end

  def disable!
    update!(usable: false)
  end

  def enable!
    update!(usable: true)
  end

  def image_url
    return asset_url if asset_type == 'URL'
    return nil unless asset_file.attached?

    Rails.application.routes.url_helpers.rails_blob_url(asset_file, only_path: false)
  end
end
