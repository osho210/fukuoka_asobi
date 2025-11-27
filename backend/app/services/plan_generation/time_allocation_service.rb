# frozen_string_literal: true

module PlanGeneration
  # 時間配分処理を担当するサービスクラス
  # 各スポットの滞在時間と移動時間を計算し、利用可能時間内に収まるよう調整する
  class TimeAllocationService
    # デフォルトの滞在時間（分）
    # カテゴリごとに適切な滞在時間を設定
    DEFAULT_STAY_TIMES = {
      'カフェ' => 60,           # 1時間
      'レストラン' => 90,       # 1.5時間
      '居酒屋' => 120,          # 2時間
      '美術館' => 120,          # 2時間
      '公園' => 90,             # 1.5時間
      'ショッピング' => 120,    # 2時間
      '温泉' => 120,            # 2時間
      '観光地' => 90,           # 1.5時間
      'アクティビティ' => 120,  # 2時間
      '体験' => 90,             # 1.5時間
      '絶景' => 60,             # 1時間
      '道の駅' => 45,           # 45分
      '神社・寺' => 60,         # 1時間
      'イベント' => 120,        # 2時間
      'その他' => 90,           # 1.5時間（デフォルト）
      'default' => 90           # 1.5時間（デフォルト）
    }.freeze

    # 時間配分処理を実行
    # @param route_spots [Array<Spot>] ルート最適化済みのスポット配列
    # @param total_available_time [Integer] 利用可能時間（分）
    # @param custom_options [Hash] カスタムオプション
    # @return [Array<Hash>] 時間配分情報を含むルート情報の配列
    #   [{ spot: Spot, stay_time: Integer, travel_time: Integer|nil, travel_method: String }]
    def self.allocate(route_spots, total_available_time, custom_options: {})
      return [] if route_spots.empty?

      # 各スポットの滞在時間を決定
      stay_times = calculate_stay_times(route_spots)

      # 移動時間を計算
      travel_times = calculate_travel_times(route_spots, custom_options)

      # 総所要時間を計算
      total_time = stay_times.sum + travel_times.sum

      # 利用可能時間を超える場合は滞在時間を調整
      stay_times = adjust_stay_times(stay_times, travel_times, total_available_time, total_time)

      # 時間配分情報を含むルート情報を作成
      build_route_with_times(route_spots, stay_times, travel_times, custom_options)
    end

    # 各スポットの滞在時間を計算
    # @param route_spots [Array<Spot>] スポット配列
    # @return [Array<Integer>] 滞在時間の配列（分）
    def self.calculate_stay_times(route_spots)
      route_spots.map do |spot|
        # スポットのカテゴリに基づいて滞在時間を決定
        category = spot.categories.first&.name || 'default'
        DEFAULT_STAY_TIMES[category] || DEFAULT_STAY_TIMES['default']
      end
    end

    # 移動時間を計算
    # @param route_spots [Array<Spot>] スポット配列
    # @param custom_options [Hash] カスタムオプション
    # @return [Array<Integer>] 移動時間の配列（分）
    def self.calculate_travel_times(route_spots, custom_options)
      return [] if route_spots.size <= 1

      travel_method = custom_options[:transportation_method] || custom_options['transportation_method'] || 'car'

      (0...route_spots.size - 1).map do |i|
        calculate_single_travel_time(route_spots[i], route_spots[i + 1], travel_method)
      end
    end

    # 1区間の移動時間を計算
    # TODO: 実際の実装ではGoogle Maps APIなどを使用して実際の移動時間を取得
    # 現在はダミー実装（移動手段に応じたランダムな時間）
    # @param from_spot [Spot] 出発スポット
    # @param to_spot [Spot] 到着スポット
    # @param travel_method [String] 移動手段
    # @return [Integer] 移動時間（分）
    def self.calculate_single_travel_time(from_spot, to_spot, travel_method)
      case travel_method
      when 'walk', '徒歩'
        rand(15..45) # 15〜45分
      when 'car', '車'
        rand(5..20) # 5〜20分
      when 'train', '電車'
        rand(10..30) # 10〜30分
      when 'bicycle', '自転車'
        rand(10..25) # 10〜25分
      else
        rand(10..30) # デフォルト（その他）
      end
    end

    # 滞在時間を調整
    # 利用可能時間を超える場合は、滞在時間を比例配分で調整
    # @param stay_times [Array<Integer>] 滞在時間の配列
    # @param travel_times [Array<Integer>] 移動時間の配列
    # @param total_available_time [Integer] 利用可能時間（分）
    # @param total_time [Integer] 総所要時間（分）
    # @return [Array<Integer>] 調整後の滞在時間の配列
    def self.adjust_stay_times(stay_times, travel_times, total_available_time, total_time)
      return stay_times if total_time <= total_available_time

      # 滞在時間を比例配分で調整
      total_travel_time = travel_times.sum
      available_stay_time = total_available_time - total_travel_time

      # 移動時間だけで利用可能時間を超える場合は調整不可
      return stay_times if available_stay_time <= 0

      adjustment_ratio = available_stay_time / stay_times.sum.to_f
      stay_times.map { |time| (time * adjustment_ratio).to_i }
    end

    # 時間配分情報を含むルート情報を構築
    # @param route_spots [Array<Spot>] スポット配列
    # @param stay_times [Array<Integer>] 滞在時間の配列
    # @param travel_times [Array<Integer>] 移動時間の配列
    # @param custom_options [Hash] カスタムオプション
    # @return [Array<Hash>] 時間配分情報を含むルート情報
    def self.build_route_with_times(route_spots, stay_times, travel_times, custom_options)
      travel_method = custom_options[:transportation_method] || custom_options['transportation_method'] || 'car'

      route_spots.each_with_index.map do |spot, i|
        {
          spot: spot,
          stay_time: stay_times[i],
          travel_time: i < route_spots.size - 1 ? travel_times[i] : nil,
          travel_method: travel_method
        }
      end
    end

    private_class_method :calculate_stay_times, :calculate_travel_times, :calculate_single_travel_time,
                         :adjust_stay_times, :build_route_with_times
  end
end
