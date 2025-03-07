class InstagramEmbed < ApplicationRecord
  has_many :store_instagram_embeds, dependent: :destroy
  has_many :stores, through: :store_instagram_embeds

  validates :instagram_embed_name, presence: true, uniqueness: true
  validates :embed_code, presence: true
  validates :embed_url, presence: true
end
