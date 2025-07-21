class Magazine < ApplicationRecord
  has_many :spot_magazines, dependent: :destroy
  has_many :spots, through: :spot_magazines

  enum :status, { draft: 'draft', published: 'published' }

  validates :name, presence: true
  validates :status, presence: true
end
