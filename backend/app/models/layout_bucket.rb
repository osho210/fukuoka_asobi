# frozen_string_literal: true

# レイアウトバケット
# UIの「テンプレ × 色 × ズレ（上下左右）」を1つのバケットとして管理
class LayoutBucket < ApplicationRecord
  has_many :bucket_list_items, dependent: :restrict_with_error

  # Enum定義
  enum :shift, { neutral: "neutral", up: "up", down: "down", left: "left", right: "right" }, default: :neutral
  enum :tilt, { no_tilt: "no_tilt", cw: "cw", ccw: "ccw" }, default: :no_tilt
  enum :depth, { flat: "flat", lift: "lift" }, default: :flat
  enum :status, { active: "active", inactive: "inactive" }, default: :active

  # バリデーション
  validates :key, presence: true, uniqueness: true, length: { maximum: 64 }
  validates :name, presence: true, length: { maximum: 128 }
  validates :template_key, presence: true, length: { maximum: 64 }
  validates :theme_key, presence: true, length: { maximum: 32 }
  validates :sort_order, presence: true, numericality: { only_integer: true }
end
