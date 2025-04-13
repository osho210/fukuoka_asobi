class Bookmark < ApplicationRecord
  belongs_to :user
  belongs_to :bookmarkable, polymorphic: true

  validates :user_id, presence: true
  validates :bookmarkable_type, presence: true
  validates :bookmarkable_id, presence: true
  validates :user_id, uniqueness: { scope: [:bookmarkable_type, :bookmarkable_id], message: "は既にこのアイテムをブックマークしています" }

  # 最新のブックマークを取得するスコープ
  scope :latest, -> { order(created_at: :desc) }

  # ユーザーのブックマークを取得するスコープ
  scope :by_user, ->(user_id) { where(user_id: user_id) }

  # 特定のタイプのブックマークを取得するスコープ
  scope :by_type, ->(type) { where(bookmarkable_type: type) }
end
