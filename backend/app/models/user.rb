class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  # Note: Removed :database_authenticatable, :registerable, :recoverable, :validatable
  # to support Google OAuth-only authentication
  devise :rememberable, :trackable, :jwt_authenticatable, jwt_revocation_strategy: self

  # ActiveStorage
  has_one_attached :avatar

  has_many :play_plans, dependent: :nullify
  has_many :news, foreign_key: :author_id, dependent: :nullify
  has_many :bookmarks, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :favorite_play_plans, through: :favorites, source: :play_plan
  has_many :payment_transactions, dependent: :destroy

  validates :username, presence: true
  validates :email, presence: true, uniqueness: true
  validates :gender, inclusion: { in: %w(male female prefer_not_to_say) }, allow_nil: true

  # ロールの定義
  enum :role, {
    admin: '管理者',
    store_owner: '店舗運営者',
    editor: '編集部',
    user: 'ユーザー'
  }, default: :user

  # 性別の定義
  enum :gender, {
    male: '男性',
    female: '女性',
    prefer_not_to_say: '回答しない'
  }, default: :prefer_not_to_say

  # JWT認証用のJTI（JWT ID）を生成するメソッド
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # 課金ユーザーかどうかを判定するメソッド
  def paid_member?
    is_paid_member && paid_end_date && paid_end_date >= Date.today
  end

  # Override Devise's password requirement for Google OAuth users
  def password_required?
    false
  end

  def email_required?
    true
  end
end
