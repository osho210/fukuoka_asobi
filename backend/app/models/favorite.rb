class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :play_plan

  validates :user_id, presence: true
  validates :play_plan_id, presence: true
  validates :user_id, uniqueness: { scope: :play_plan_id, message: "既にこのプランをお気に入りに登録しています" }

  # 最新のお気に入りを取得するスコープ
  scope :latest, -> { order(created_at: :desc) }

  # ユーザーのお気に入りを取得するスコープ
  scope :by_user, ->(user_id) { where(user_id: user_id) }
end
