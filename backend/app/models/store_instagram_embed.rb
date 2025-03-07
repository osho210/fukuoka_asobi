class StoreInstagramEmbed < ApplicationRecord
  belongs_to :store
  belongs_to :instagram_embed

  validates :store_id, uniqueness: { scope: :instagram_embed_id }
end
