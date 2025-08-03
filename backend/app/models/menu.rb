class Menu < ApplicationRecord
  belongs_to :menu_category, optional: true
  has_many :spot_menus, dependent: :destroy
  has_many :spots, through: :spot_menus

  # Active Storage関連付け
  has_one_attached :image

  validates :menu_name, presence: true

  # 画像のバリデーション
  # validate :image_validation, if: -> { image.attached? }

  # private

  # def image_validation
  #   if image.attached?
  #     # ファイル形式のバリデーション
  #     unless image.content_type.in?(%w[image/jpeg image/jpg image/png image/gif image/svg])
  #       errors.add(:image, 'は有効な画像形式である必要があります')
  #     end

  #     # ファイルサイズのバリデーション
  #     if image.blob.byte_size > 5.megabytes
  #       errors.add(:image, 'は5MB以下である必要があります')
  #     end
  #   end
  # end
end
