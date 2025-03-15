class PlayPlan < ApplicationRecord
  belongs_to :user, optional: true
  has_many :plan_details, foreign_key: :plan_id, dependent: :destroy

  validates :plan_name, presence: true

  # ステータスの定義
  enum :status, { draft: 0, published: 1 }, default: :draft

  # 旅行タイプの定義
  enum :trip_type, { day_trip: 0, overnight: 1 }, default: :day_trip

  # 公開中のプランのみを取得するスコープ
  scope :published, -> { where(status: :published) }

  # 最新のプランを取得するスコープ
  scope :latest, -> { order(created_at: :desc) }

  # ユーザーが作成したプランを取得するスコープ
  scope :by_user, ->(user_id) { where(user_id: user_id) }
end
