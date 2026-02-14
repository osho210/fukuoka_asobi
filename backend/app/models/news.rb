class News < ApplicationRecord
  belongs_to :author, class_name: 'User', optional: true
  belongs_to :category, optional: true

  # Google Search Console API関連の関連付け
  has_one :google_index_status, as: :indexable, dependent: :destroy

  validates :title, presence: true
  validates :body, presence: true
  validates :status, presence: true

  scope :published, -> { where(status: :published).where('published_at <= ?', Time.current) }
  scope :recent, -> { order(published_at: :desc) }
  scope :by_category, ->(category_id) { where(category_id: category_id) if category_id.present? }

  private
  # 公開日が現在よりも未来の場合は、statusがpublishedの場合エラーを出す
  def validate_published_at
    if status == 'published' && published_at.present? && published_at > Time.current
      errors.add(:published_at, '公開日は現在よりも未来の日付を設定してください')
    end
  end
end
