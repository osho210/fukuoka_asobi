# frozen_string_literal: true

# 検索パラメータが不正な場合に発生するエラー
# バリデーションエラーの詳細情報を保持する
class InvalidSearchParametersError < PlanGenerationError
  # エラーを初期化
  # @param message [String] エラーメッセージ
  # @param details [Hash] バリデーションエラーの詳細（フィールド名とエラーメッセージのマップ）
  def initialize(message = nil, details: {})
    super(
      message || I18n.t('errors.plan_generation.invalid_parameters'),
      code: 'INVALID_SEARCH_PARAMETERS',
      details: details
    )
  end
end
