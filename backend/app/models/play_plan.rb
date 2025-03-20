class PlayPlan < ApplicationRecord
  belongs_to :user, optional: true
  has_many :plan_details, foreign_key: :plan_id, dependent: :destroy
  has_many :play_plan_recommended_fors, dependent: :destroy
  has_many :recommended_fors, through: :play_plan_recommended_fors

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

  # recommended_for文字列からRecommendedForオブジェクトを作成・関連付けするメソッド
  def recommended_for_string=(value)
    return if value.blank?

    # 既存の関連をクリア
    play_plan_recommended_fors.destroy_all

    # カンマで区切られた文字列を配列に変換
    names = value.split(',').map(&:strip).reject(&:blank?)

    # 各名前に対応するRecommendedForを取得または作成し、関連付け
    names.each do |name|
      recommended_for = RecommendedFor.find_or_create_by(name: name)
      recommended_fors << recommended_for unless recommended_fors.include?(recommended_for)
    end
  end

  # RecommendedForオブジェクトからカンマ区切りの文字列を生成するメソッド
  def recommended_for_string
    recommended_fors.map(&:name).join(', ')
  end
end
