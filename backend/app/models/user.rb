class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :trackable, :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :play_plans, dependent: :nullify
  has_many :news, foreign_key: :author_id, dependent: :nullify

  validates :username, presence: true
  validates :email, presence: true, uniqueness: true
  validates :gender, inclusion: { in: %w(male female prefer_not_to_say) }
  validates :terms_agreed, acceptance: { accept: true, message: 'を承諾してください' }, on: :create

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
end
