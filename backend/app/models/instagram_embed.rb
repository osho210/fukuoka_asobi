class InstagramEmbed < ApplicationRecord
  has_many :spot_instagram_embeds, dependent: :destroy
  has_many :spots, through: :spot_instagram_embeds

  validates :instagram_embed_name, presence: true, uniqueness: true
  validates :embed_code, presence: true
  validates :embed_url, presence: true
end
