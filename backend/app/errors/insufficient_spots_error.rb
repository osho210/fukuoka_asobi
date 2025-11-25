# frozen_string_literal: true

# 検索条件に合うスポットが不足している場合に発生するエラー
# ユーザーに条件を緩和するよう促す
class InsufficientSpotsError < PlanGenerationError
  # エラーを初期化
  # @param message [String] エラーメッセージ
  # @param required_count [Integer] 必要なスポット数
  # @param found_count [Integer] 見つかったスポット数
  def initialize(message = nil, required_count: 0, found_count: 0)
    super(
      message || I18n.t('errors.plan_generation.insufficient_spots'),
      code: 'INSUFFICIENT_SPOTS',
      details: { required_count: required_count, found_count: found_count }
    )
  end
end
