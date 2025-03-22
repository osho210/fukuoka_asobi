class TravelDetail < ApplicationRecord
  belongs_to :plan_detail

  validates :sequence_number, presence: true
  validates :travel_method, presence: true
  validates :travel_method, inclusion: { in: %w(徒歩 電車 車 自転車 その他) }

  # 移動時間のバリデーション（存在する場合は正の整数）
  validates :travel_time, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true

  # 同じplan_detailに対して同じsequence_numberを持つレコードが存在しないことを確認
  validates :sequence_number, uniqueness: { scope: :plan_detail_id }
end
