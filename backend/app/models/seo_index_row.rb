# frozen_string_literal: true

# SEOインデックス一覧のレコードを表すラッパークラス
#
# GraphQLのSeoIndexRowTypeで返却するためのラッパーオブジェクト。
# 異なるモデル（Spot, PlayPlan, Event, News）を統一的に扱うためのクラス。
class SeoIndexRow
  attr_reader :record, :type_name, :url

  # コンストラクタ
  #
  # Args:
  #   record (ActiveRecord::Base): 元のレコード（Spot, PlayPlan, Event, News）
  #   type_name (String): レコード種別（spot, plan, event, news）
  #   url (String): フロントエンドのURL
  def initialize(record, type_name, url)
    @record = record
    @type_name = type_name
    @url = url
  end

  # レコードIDを返す
  def id
    @record.id
  end

  # タイトルを返す
  def title
    case @type_name
    when 'spot'
      @record.spot_name
    when 'plan'
      @record.plan_name
    when 'event', 'news'
      @record.title
    else
      ''
    end
  end

  # レコード種別を返す
  def type
    @type_name
  end

  # ステータスを返す
  def status
    case @type_name
    when 'spot', 'plan'
      @record.is_public ? 'published' : 'draft'
    when 'event', 'news'
      @record.status.to_s.downcase
    else
      'draft'
    end
  end

  # is_indexableを返す
  def is_indexable
    @record.is_indexable
  end

  # 更新日時を返す
  def updated_at
    @record.updated_at
  end

  # Googleインデックス状態を返す
  def google_index_status
    @record.google_index_status
  end

  # ソート用にComparableを実装
  def <=>(other)
    other.updated_at <=> updated_at
  end
end
