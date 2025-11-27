# frozen_string_literal: true

# プラン生成時の基本エラークラス
# すべてのプラン生成関連のエラーはこのクラスを継承する
class PlanGenerationError < StandardError
  attr_reader :code, :details

  # エラーを初期化
  # @param message [String] エラーメッセージ
  # @param code [String] エラーコード（例: 'PLAN_GENERATION_ERROR'）
  # @param details [Hash] 追加のエラー詳細情報
  def initialize(message = nil, code: 'PLAN_GENERATION_ERROR', details: {})
    @code = code
    @details = details
    super(message || I18n.t('errors.plan_generation.internal_error'))
  end
end
