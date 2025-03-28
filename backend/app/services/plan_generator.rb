require 'ostruct'
require 'securerandom'

module Services
  class PlanGenerator
    def initialize(districts:, date:, member_info:, budget:, start_time: nil, end_time: nil, custom_options: nil)
      @districts = districts
      @date = Date.parse(date)
      @member_info = member_info
      @budget = budget
      @start_time = start_time ? Time.parse("#{date} #{start_time}") : Time.parse("#{date} 09:00")
      @end_time = end_time ? Time.parse("#{date} #{end_time}") : Time.parse("#{date} 21:00")
      @custom_options = custom_options || {}
      @total_available_time = (@end_time - @start_time) / 60 # 分単位
    end

    def generate
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

    # 1. スポットのフィルタリング
    def filter_spots
      # 基本クエリ
      query = Spot.all

      # 地区によるフィルタリング
      if @districts.present?
        # 数値IDとslugの両方に対応
        district_ids = @districts.map do |district_identifier|
          # 数値IDの場合はそのまま使用
          if district_identifier.is_a?(Integer) || district_identifier.to_i.to_s == district_identifier.to_s
            district_identifier
          else
            # 文字列（slug）の場合はIDに変換
            District.find_by(slug: district_identifier)&.id
          end
        end.compact

        query = query.where(district_id: district_ids)
      end

      # 営業時間によるフィルタリング
      day_of_week = @date.strftime("%a").downcase
      query = query.joins(:opening_hours)
                  .where("opening_hours.day_of_week = ? AND opening_hours.is_closed_day = false", day_of_week)
                  .where("opening_hours.open_time <= ? AND opening_hours.close_time >= ?",
                         @end_time.strftime("%H:%M"), @start_time.strftime("%H:%M"))

      # 予算によるフィルタリング
      # 注: 予算はスポット単位ではなくプラン全体で考慮するため、ここでは緩めのフィルタリング
      if @budget[:max] <= 5000
        query = query.where(budget_range: "安い")
      elsif @budget[:max] <= 15000
        query = query.where(budget_range: ["安い", "普通"])
      end

      # カスタムオプションによるフィルタリング
      if @custom_options.present?
        # 雨天対応
        query = query.where(is_rainy_ok: true) if @custom_options[:rainy_day_option]

        # テーマ
        query = query.where(theme: @custom_options[:theme]) if @custom_options[:theme].present?

        # カテゴリー
        if @custom_options[:categories].present?
          query = query.joins(:categories).where(categories: { name: @custom_options[:categories] })
        end
      end

      # 重複を除去して結果を返す
      query.distinct
    end

    # 2. スポットのスコアリング
    def score_spots(spots)
      spots.map do |spot|
        score = 0

        # 基本スコア
        score += spot.review_rating * 10 if spot.review_rating # 評価が高いほど加点

        # テーマ適合度
        if @custom_options[:theme].present? && spot.theme == @custom_options[:theme]
          score += 30 # テーマに合致する場合は大きく加点
        end

        # カテゴリ適合度
        if @custom_options[:categories].present?
          spot_categories = spot.categories.pluck(:name)
          matching_categories = spot_categories & @custom_options[:categories]
          score += matching_categories.size * 20 # マッチするカテゴリごとに加点
        end

        # 雨天対応
        if @custom_options[:rainy_day_option] && spot.is_rainy_ok
          score += 15 # 雨天対応の場合は加点
        end

        # 予算適合度
        budget_score = case spot.budget_range
        when "安い"
          15 # 安い場合は加点
        when "高い"
          -10 # 高い場合は減点
        else
          0 # 普通の場合は変化なし
        end
        score += budget_score

        # 利用メンバー適合度
        if @member_info[:recommended_for_ids].present?
          spot_recommended_fors = spot.recommended_fors.pluck(:id)
          matching_recommended_fors = spot_recommended_fors & @member_info[:recommended_for_ids]
          score += matching_recommended_fors.size * 25 # マッチするおすすめ対象ごとに加点
        end

        { spot: spot, score: score }
      end.sort_by { |item| -item[:score] } # スコアの高い順にソート
    end

    # 3. スポットの選定
    def select_spots(scored_spots)
      # カスタムオプションでスポット数が指定されている場合はその数、そうでなければデフォルト3つ
      spot_count = @custom_options[:spot_count] || 3

      # スコアの高い順に指定数選択
      selected = scored_spots.take(spot_count)

      # 選択されたスポットを返す
      selected.map { |item| item[:spot] }
    end

    # 4. ルート最適化
    def optimize_route(spots)
      # 出発地点が指定されている場合
      if @custom_options[:starting_point].present?
        # 出発地点をダミースポットとして追加
        start_spot = Spot.new(
          id: 0,
          spot_name: @custom_options[:starting_point],
          address: @custom_options[:starting_point]
        )

        # 出発地点を含めたスポットリスト
        all_spots = [start_spot] + spots

        # 距離行列を計算（実際の実装ではGoogle Maps APIなどを使用）
        distances = calculate_distance_matrix(all_spots)

        # TSP（巡回セールスマン問題）を解く
        # 注: 実際の実装では専用のアルゴリズムを使用
        # ここでは簡易的な貪欲法で実装
        route = [0] # 出発地点のインデックス
        remaining = (1...all_spots.size).to_a

        while !remaining.empty?
          current = route.last
          nearest = remaining.min_by { |i| distances[current][i] }
          route << nearest
          remaining.delete(nearest)
        end

        # 出発地点に戻る
        route << 0

        # ルートをスポットの配列に変換
        route_spots = route.map { |i| all_spots[i] }

        # 出発地点を除外（最初と最後）
        route_spots = route_spots[1...-1]
      else
        # 出発地点が指定されていない場合は単純に距離行列を計算
        distances = calculate_distance_matrix(spots)

        # 最も効率的な順序を決定（簡易的な実装）
        # 実際の実装ではTSPアルゴリズムを使用
        route_spots = spots
      end

      route_spots
    end

    # 距離行列を計算（ダミー実装）
    def calculate_distance_matrix(spots)
      # 実際の実装ではGoogle Maps APIなどを使用して実際の距離や移動時間を取得
      # ここではダミーデータを返す
      spots.size.times.map do |i|
        spots.size.times.map do |j|
          i == j ? 0 : rand(1..30) # 1〜30分のランダムな移動時間
        end
      end
    end

    # 5. 時間配分
    def allocate_time(route_spots)
      # 各スポットのデフォルト滞在時間（分）
      default_stay_times = {
        'cafe' => 60,
        'restaurant' => 90,
        'museum' => 120,
        'park' => 90,
        'shopping' => 120,
        'onsen' => 120,
        'default' => 90
      }

      # 移動時間を計算（実際の実装ではGoogle Maps APIなどを使用）
      travel_times = []
      (0...route_spots.size-1).each do |i|
        # 移動手段に応じた移動時間を計算
        travel_method = @custom_options[:transportation_method] || 'car'
        travel_time = calculate_travel_time(route_spots[i], route_spots[i+1], travel_method)
        travel_times << travel_time
      end

      # 各スポットの滞在時間を決定
      stay_times = route_spots.map do |spot|
        # スポットのカテゴリに基づいて滞在時間を決定
        category = spot.categories.first&.name || 'default'
        default_stay_times[category] || default_stay_times['default']
      end

      # 総所要時間を計算
      total_time = stay_times.sum + travel_times.sum

      # 利用可能時間を超える場合は調整
      if total_time > @total_available_time
        # 滞在時間を比例配分で調整
        adjustment_ratio = (@total_available_time - travel_times.sum) / stay_times.sum.to_f
        stay_times = stay_times.map { |time| (time * adjustment_ratio).to_i }
      end

      # 時間配分情報を含むルート情報を作成
      route_with_times = []
      route_spots.each_with_index do |spot, i|
        route_with_times << {
          spot: spot,
          stay_time: stay_times[i],
          travel_time: i < route_spots.size - 1 ? travel_times[i] : nil,
          travel_method: @custom_options[:transportation_method] || 'car'
        }
      end

      route_with_times
    end

    # 移動時間を計算（ダミー実装）
    def calculate_travel_time(from_spot, to_spot, travel_method)
      # 実際の実装ではGoogle Maps APIなどを使用
      # ここではダミーデータを返す
      case travel_method
      when 'walk'
        rand(15..45) # 15〜45分
      when 'car'
        rand(5..20) # 5〜20分
      when 'train'
        rand(10..30) # 10〜30分
      else
        rand(10..30) # デフォルト
      end
    end

    # 6. プラン生成
    def create_plan(route_with_times)
      # プラン名を生成
      # IDまたはslugから地区名を取得
      district_names = @districts.map do |district_identifier|
        if district_identifier.is_a?(Integer) || district_identifier.to_i.to_s == district_identifier.to_s
          District.find_by(id: district_identifier)&.district_name
        else
          District.find_by(slug: district_identifier)&.district_name
        end
      end.compact.join('・')

      pp '----district----------'
      pp @districts
      pp '--------------'

      theme_name = @custom_options[:theme].present? ?
                  Resolvers::ThemeOptionsResolver.new.resolve.find { |t| t[:id] == @custom_options[:theme] }&.dig(:label) :
                  '遊び'
      #TODO: 暫定的にプラン名は固定で表示させるが将来的にはランダムでプランが生成されるように変更する
      plan_name = "#{district_names}で#{theme_name}プラン"

      # 総予算を計算（予算レンジから概算）
      budget_values = {
        "安い" => 3000,
        "普通" => 8000,
        "高い" => 15000
      }
      total_budget = route_with_times.sum do |item|
        budget_values[item[:spot].budget_range] || budget_values["普通"]
      end

      # 開始・終了時間を計算
      current_time = @start_time
      end_datetime = current_time

      route_with_times.each do |item|
        # スポット滞在
        current_time += item[:stay_time] * 60 # 秒に変換

        # 移動
        if item[:travel_time]
          current_time += item[:travel_time] * 60 # 秒に変換
        end

        end_datetime = current_time
      end

      # PlayPlanを作成
      play_plan = PlayPlan.new(
        id: SecureRandom.random_number(10000),
        plan_name: plan_name,
        description: "#{@date.strftime('%Y年%m月%d日')}の#{plan_name}です。",
        status: 'draft',
        start_datetime: @start_time,
        end_datetime: end_datetime,
        total_budget: total_budget,
        trip_type: 'day_trip'
      )

      # PlanDetailとTravelDetailを作成
      current_time = @start_time
      route_with_times.each_with_index do |item, index|
        # スポット滞在の開始・終了時間
        stay_start = current_time
        stay_end = current_time + item[:stay_time] * 60
        current_time = stay_end

        # 予算を設定（予算レンジから概算）
        spot_budget = budget_values[item[:spot].budget_range] || budget_values["普通"]

        # PlanDetailを作成
        plan_detail = play_plan.plan_details.build(
          id: SecureRandom.random_number(10000),
          step_number: index + 1,
          step_name: item[:spot].spot_name,
          step_description: item[:spot].catchphrase,
          spot: item[:spot],
          start_datetime: stay_start,
          end_datetime: stay_end,
          budget: spot_budget
        )

        # 移動がある場合はTravelDetailを作成
        if item[:travel_time]
          travel_start = stay_end
          travel_end = travel_start + item[:travel_time] * 60
          current_time = travel_end

          plan_detail.travel_details.build(
            id: SecureRandom.random_number(10000),
            sequence_number: 1,
            travel_method: item[:travel_method],
            travel_time: item[:travel_time]
          )
        end
      end

      # 旅行ルート情報を作成
      travel_route = create_travel_route(route_with_times)

      # プランに旅行ルート情報を追加
      play_plan.instance_variable_set(:@travel_route, travel_route)

      # travel_routeメソッドを動的に追加
      def play_plan.travel_route
        @travel_route
      end

      # プランを返す（実際の実装では保存も行う）
      play_plan
    end

    # 旅行ルート情報を作成
    def create_travel_route(route_with_times)
      # 総移動距離と総移動時間を計算
      total_travel_time = route_with_times.sum { |item| item[:travel_time] || 0 }

      # 旅行セグメントを作成
      travel_segments = []
      (0...route_with_times.size-1).each do |i|
        from_spot = route_with_times[i][:spot]
        to_spot = route_with_times[i+1][:spot]
        travel_time = route_with_times[i][:travel_time]
        travel_method = route_with_times[i][:travel_method]

        # ダミーの距離を計算（実際の実装ではGoogle Maps APIなどを使用）
        distance = travel_time * 0.5 # 時間（分）× 0.5km/分 = 距離（km）

        # OpenStruct（または独自クラス）を使用してセグメントを作成
        segment = OpenStruct.new(
          from_spot: from_spot,
          to_spot: to_spot,
          distance: distance,
          travel_time: travel_time,
          travel_method: travel_method
        )

        travel_segments << segment
      end

      # 総距離を計算
      total_distance = travel_segments.sum { |segment| segment.distance || 0 }

      # OpenStruct（または独自クラス）を使用して旅行ルート情報を作成
      OpenStruct.new(
        total_distance: total_distance,
        total_travel_time: total_travel_time,
        travel_segments: travel_segments
      )
    end
  end
end
