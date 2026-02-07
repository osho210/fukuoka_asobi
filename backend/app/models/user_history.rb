class UserHistory < ApplicationRecord
  belongs_to :user
  belongs_to :viewable, polymorphic: true

  validates :user_id, presence: true
  validates :viewable_type, presence: true
  validates :viewable_id, presence: true
  validates :viewed_at, presence: true

  # 最新の閲覧履歴を取得するスコープ
  scope :latest, -> { order(viewed_at: :desc) }

  # ユーザーの閲覧履歴を取得するスコープ
  scope :by_user, ->(user_id) { where(user_id: user_id) }

  # 特定のタイプの閲覧履歴を取得するスコープ
  scope :by_type, ->(type) { where(viewable_type: type) }

  # 期間を指定して閲覧履歴を取得するスコープ
  scope :within_period, ->(start_date, end_date) { where(viewed_at: start_date..end_date) }

  # 閲覧履歴を作成または更新するクラスメソッド
  # 同じユーザーが同じコンテンツを閲覧した場合、viewed_atのみ更新
  def self.record_view(user_id, viewable)
    history = find_or_initialize_by(
      user_id: user_id,
      viewable: viewable
    )
    history.viewed_at = Time.current
    history.save!
    history
  end
end
