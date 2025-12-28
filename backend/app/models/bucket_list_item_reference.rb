# frozen_string_literal: true

# バケットリスト企画の参考Webサイト
class BucketListItemReference < ApplicationRecord
  belongs_to :bucket_list_item

  # Enum定義
  enum :reference_type, {
    official: 'official',
    map: 'map',
    article: 'article',
    reservation: 'reservation',
    other: 'other'
  }, default: :other, prefix: true

  # バリデーション
  validates :title, length: { maximum: 255 }, allow_nil: true
  validates :url, presence: true
  validates :sort_order, presence: true, numericality: { only_integer: true }

  # デフォルトスコープ: sort_orderで並び替え
  default_scope { order(sort_order: :asc) }
end
