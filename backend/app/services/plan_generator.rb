# frozen_string_literal: true

require 'ostruct'
require 'securerandom'
require_relative 'validators/search_params_validator'

# プラン自動生成サービスのメインクラス
# 検索条件に基づいてスポットを検索し、最適なプランを生成する
# 各処理は専用のサービスクラスに委譲され、このクラスは全体のオーケストレーションを担当する
class PlanGenerator
  # プランジェネレーターを初期化
  # @param districts [Array<String|Integer>] 地区ID または slug の配列
  # @param date [String] 検索対象日（YYYY-MM-DD形式）
  # @param member_info [Hash] メンバー情報（recommend_users など）
  # @param budget [Hash] 予算情報（min, max）
  # @param start_time [String, nil] 開始時刻（HH:MM形式）
  # @param end_time [String, nil] 終了時刻（HH:MM形式）
  # @param custom_options [Hash, nil] カスタムオプション
  # @param user [User, nil] ユーザー（プレミアム機能の判定に使用）
  def initialize(districts:, date:, member_info:, budget:, start_time: nil, end_time: nil, custom_options: nil, user: nil)
    @districts = districts
    @date = Date.parse(date)
    @member_info = member_info
    @budget = budget
    # Time.zone.parseを使用してJSTとして時刻をパース
    @start_time = start_time ? Time.zone.parse("#{date} #{start_time}") : Time.zone.parse("#{date} 09:00")
    @end_time = end_time ? Time.zone.parse("#{date} #{end_time}") : Time.zone.parse("#{date} 21:00")
    @custom_options = custom_options || {}
    @total_available_time = (@end_time - @start_time) / 60 # 分単位
    @user = user
  end

  # プラン生成処理を実行
  # @return [PlayPlan] 生成されたプラン
  # @raise [InvalidSearchParametersError] 検索パラメータが不正な場合
  # @raise [InsufficientSpotsError] 検索条件に合うスポットが不足している場合
  # @raise [PlanGenerationError] プラン生成中にエラーが発生した場合
  def generate
    # パラメータのバリデーション
    validate_params

    # 1. スポットのフィルタリング
    filtered_spots = filter_spots

    # 2. スポットのスコアリング
    scored_spots = score_spots(filtered_spots)

    # 3. スポットの選定
    selected_spots = select_spots(scored_spots)

    # 4. ルート最適化
    optimized_route = optimize_route(selected_spots)

    # 5. 時間配分
    time_allocated_route = allocate_time(optimized_route)

    # 6. プラン生成
    create_plan(time_allocated_route)
  end

  private

  # パラメータのバリデーション
  # @raise [InvalidSearchParametersError] パラメータが不正な場合
  def validate_params
    SearchParamsValidator.validate!(
      districts: @districts,
      date: @date.to_s,
      member_info: @member_info,
      budget: @budget,
      start_time: @start_time&.strftime("%H:%M"),
      end_time: @end_time&.strftime("%H:%M"),
      custom_options: @custom_options
    )
  end

  # スポットのフィルタリング
  # SpotFilterServiceに処理を委譲
  # @return [ActiveRecord::Relation] フィルタリングされたスポット
  def filter_spots
    PlanGeneration::SpotFilterService.filter(
      districts: @districts,
      date: @date,
      start_time: @start_time,
      end_time: @end_time,
      budget: @budget,
      custom_options: @custom_options,
      user: @user
    )
  end

  # スポットのスコアリング
  # SpotScoringServiceに処理を委譲
  # @param spots [ActiveRecord::Relation] フィルタリング済みスポット
  # @return [Array<Hash>] スコア付きスポット情報の配列
  def score_spots(spots)
    PlanGeneration::SpotScoringService.score(
      spots,
      custom_options: @custom_options,
      member_info: @member_info
    )
  end

  # スポットの選定
  # SpotSelectionServiceに処理を委譲
  # @param scored_spots [Array<Hash>] スコア付きスポット情報の配列
  # @return [Array<Spot>] 選定されたスポット
  def select_spots(scored_spots)
    PlanGeneration::SpotSelectionService.select(
      scored_spots,
      custom_options: @custom_options
    )
  end

  # ルート最適化
  # RouteOptimizationServiceに処理を委譲
  # @param spots [Array<Spot>] 選定されたスポット
  # @return [Array<Spot>] 最適化されたルート
  def optimize_route(spots)
    PlanGeneration::RouteOptimizationService.optimize(
      spots,
      custom_options: @custom_options
    )
  end

  # 時間配分
  # TimeAllocationServiceに処理を委譲
  # @param route_spots [Array<Spot>] 最適化されたルート
  # @return [Array<Hash>] 時間配分情報を含むルート
  def allocate_time(route_spots)
    PlanGeneration::TimeAllocationService.allocate(
      route_spots,
      @total_available_time,
      custom_options: @custom_options
    )
  end

  # プラン生成
  # PlanCreationServiceに処理を委譲
  # @param route_with_times [Array<Hash>] 時間配分情報を含むルート
  # @return [PlayPlan] 生成されたプラン
  def create_plan(route_with_times)
    PlanGeneration::PlanCreationService.create(
      route_with_times: route_with_times,
      districts: @districts,
      date: @date,
      start_time: @start_time,
      custom_options: @custom_options,
      user: @user
    )
  end
end
