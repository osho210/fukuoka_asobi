# frozen_string_literal: true

require 'ostruct'

module PlanGeneration
  # ルート最適化処理を担当するサービスクラス
  # スポット間の移動距離を考慮して、最適な訪問順序を決定する
  # 現在は簡易的な貪欲法を使用（将来的にはTSPアルゴリズムの導入を検討）
  class RouteOptimizationService
    # ルート最適化処理を実行
    # @param spots [Array<Spot>] 最適化対象のスポット配列
    # @param custom_options [Hash] カスタムオプション
    # @return [Array<Spot>] 最適化されたスポットの配列
    def self.optimize(spots, custom_options: {})
      return spots if spots.empty?

      starting_point = custom_options[:starting_point] || custom_options['starting_point']

      # 出発地点が指定されている場合
      if starting_point.present?
        optimize_with_starting_point(spots, starting_point)
      else
        # 出発地点が指定されていない場合は現在の順序を維持
        # TODO: 将来的には全スポット間の距離行列を使った最適化を実装
        spots
      end
    end

    # 出発地点を考慮したルート最適化
    # @param spots [Array<Spot>] 最適化対象のスポット配列
    # @param starting_point [String] 出発地点
    # @return [Array<Spot>] 最適化されたスポットの配列
    def self.optimize_with_starting_point(spots, starting_point)
      # 出発地点をダミースポットとして作成
      start_spot = create_dummy_spot(starting_point)

      # 出発地点を含めたスポットリスト
      all_spots = [start_spot] + spots

      # 距離行列を計算
      # TODO: 実際の実装ではGoogle Maps APIなどを使用して実際の距離を取得
      distances = calculate_distance_matrix(all_spots)

      # 貪欲法で最適ルートを計算
      route = calculate_greedy_route(all_spots.size, distances)

      # ルートをスポットの配列に変換
      route_spots = route.map { |i| all_spots[i] }

      # 出発地点を除外（最初と最後）
      route_spots[1...-1]
    end

    # ダミースポットを作成
    # @param location [String] 地点名
    # @return [Spot] ダミースポット（IDは0）
    def self.create_dummy_spot(location)
      Spot.new(
        id: 0,
        spot_name: location,
        address: location
      )
    end

    # 距離行列を計算
    # TODO: 実際の実装ではGoogle Maps APIなどを使用して実際の距離や移動時間を取得
    # 現在はダミー実装（ランダムな移動時間）
    # @param spots [Array<Spot>] スポット配列
    # @return [Array<Array<Integer>>] 距離行列（移動時間、単位：分）
    def self.calculate_distance_matrix(spots)
      spots.size.times.map do |i|
        spots.size.times.map do |j|
          i == j ? 0 : rand(1..30) # 1〜30分のランダムな移動時間
        end
      end
    end

    # 貪欲法で最適ルートを計算
    # TSP（巡回セールスマン問題）の簡易解法
    # @param spot_count [Integer] スポット数
    # @param distances [Array<Array<Integer>>] 距離行列
    # @return [Array<Integer>] ルート（スポットのインデックス配列）
    def self.calculate_greedy_route(spot_count, distances)
      route = [0] # 出発地点（インデックス0）から開始
      remaining = (1...spot_count).to_a

      # 現在地から最も近いスポットを次の訪問先として選択
      while remaining.any?
        current = route.last
        nearest = remaining.min_by { |i| distances[current][i] }
        route << nearest
        remaining.delete(nearest)
      end

      # 出発地点に戻る
      route << 0

      route
    end

    private_class_method :optimize_with_starting_point, :create_dummy_spot,
                         :calculate_distance_matrix, :calculate_greedy_route
  end
end
