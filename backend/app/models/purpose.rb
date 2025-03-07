class Purpose < ApplicationRecord
  has_many :store_purposes, dependent: :destroy
  has_many :stores, through: :store_purposes

  validates :purpose_name, presence: true, uniqueness: true
end
