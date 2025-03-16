class District < ApplicationRecord
  has_many :areas, dependent: :destroy
  has_many :spots, dependent: :restrict_with_error

  validates :district_name, presence: true, uniqueness: true
end
