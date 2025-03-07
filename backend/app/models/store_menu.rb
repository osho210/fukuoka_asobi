class StoreMenu < ApplicationRecord
  belongs_to :store
  belongs_to :menu

  validates :store_id, uniqueness: { scope: :menu_id }
end
