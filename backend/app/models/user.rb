class User < ApplicationRecord
  has_many :play_plans, dependent: :nullify
  has_many :news, foreign_key: :author_id, dependent: :nullify

  validates :username, presence: true
  validates :email, presence: true, uniqueness: true

  # ロールの定義
  enum :role, {
    admin: '管理者',
    store_owner: '店舗運営者',
    editor: '編集部',
    user: 'ユーザー'
  }, default: :user

  # 課金ユーザーかどうかを判定するメソッド
  def paid_member?
    is_paid_member && paid_end_date && paid_end_date >= Date.today
  end
end
