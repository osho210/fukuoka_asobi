class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :trackable, :jwt_authenticatable, jwt_revocation_strategy: self

  # ActiveStorage
  has_one_attached :avatar

  has_many :play_plans, dependent: :nullify
  has_many :news, foreign_key: :author_id, dependent: :nullify
  has_many :bookmarks, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :favorite_play_plans, through: :favorites, source: :play_plan

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

  # パスワードリセット用のトークンを生成して保存
  def generate_password_token!
    begin
      # 独自のトークン生成ロジックを使用
      raw_token = generate_token

      # トークンを保存（Deviseの方法を使用せず、直接保存）
      self.reset_password_token = raw_token
      self.reset_password_sent_at = Time.now.current
      save!

      # 生のトークンを返す（メール送信用）
      raw_token
    rescue => e
      Rails.logger.error "パスワードトークン生成エラー: #{e.message}"
      # エラーが発生した場合でも処理を続行
      raw_token = SecureRandom.hex(10)
      self.reset_password_token = raw_token
      self.reset_password_sent_at = Time.now.current
      save(validate: false)
      raw_token
    end
  end

  # パスワードリセットトークンの有効期限をチェック
  def password_token_valid?
    reset_password_sent_at.present? && (reset_password_sent_at + 2.hours) > Time.now.current
  end

  # パスワードをリセット
  def reset_password!(password)
    begin
      self.reset_password_token = nil
      self.reset_password_sent_at = nil
      self.password = password
      save
    rescue => e
      Rails.logger.error "パスワードリセットエラー: #{e.message}"
      false
    end
  end

  private

  # ランダムなトークンを生成
  def generate_token
    SecureRandom.hex(20)
  end
end
