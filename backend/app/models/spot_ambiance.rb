class SpotAmbiance < ApplicationRecord
  has_many :spot_ambiance_relations, dependent: :destroy
  has_many :spots, through: :spot_ambiance_relations

  validates :ambiance_name, presence: true, uniqueness: true
end
