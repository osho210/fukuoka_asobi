class StoreAmbiance < ApplicationRecord
  has_many :store_ambiance_relations, dependent: :destroy
  has_many :stores, through: :store_ambiance_relations

  validates :ambiance_name, presence: true, uniqueness: true
end
