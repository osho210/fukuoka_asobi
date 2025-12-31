# frozen_string_literal: true

# バケットリスト企画のもちもの
class BucketListItemBelonging < ApplicationRecord
  belongs_to :bucket_list_item

  # バリデーション
  validates :name, presence: true, length: { maximum: 255 }
  validates :note, length: { maximum: 255 }, allow_nil: true
  validates :sort_order, presence: true, numericality: { only_integer: true }

  # デフォルトスコープ: sort_orderで並び替え
  default_scope { order(sort_order: :asc) }
end
