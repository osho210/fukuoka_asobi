class Purpose < ApplicationRecord
  has_many :spot_purposes, dependent: :destroy
  has_many :spots, through: :spot_purposes

  validates :purpose_name, presence: true, uniqueness: true
end
