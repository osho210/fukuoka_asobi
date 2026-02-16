# frozen_string_literal: true

# DMテンプレート管理モデル
# 承諾依頼のDM送信用テンプレートをバージョン管理
class DmTemplate < ApplicationRecord
  # バリデーション
  validates :name, presence: true
  validates :version, presence: true
  validates :content, presence: true
  validates :name, uniqueness: { scope: :version, message: '同じ名前とバージョンの組み合わせは登録できません' }

  # スコープ
  scope :active, -> { where(is_active: true) }
  scope :latest_version, lambda {
    select('DISTINCT ON (name) *')
      .order('name, version DESC')
  }

  # テンプレート内のプレースホルダーを置換
  # @param variables [Hash] 置換する変数のハッシュ
  # @return [String] 置換後のテンプレート文字列
  def render(variables = {})
    result = content.dup
    variables.each do |key, value|
      result.gsub!("{{#{key}}}", value.to_s)
    end
    result
  end

  # テンプレートで使用可能な変数一覧を取得
  # @return [Array<String>] 変数名の配列
  def available_variables
    content.scan(/\{\{(\w+)\}\}/).flatten.uniq
  end
end
