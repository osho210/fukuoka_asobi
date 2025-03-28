require 'ostruct'
require 'securerandom'
require 'logger'

module Services
  class PlanGenerator
    attr_reader :logger

    def initialize(districts:, date:, member_info:, budget:, start_time:, end_time: , custom_options:)
      # Railsの標準ロガーを使用
      @logger = Rails.logger
      # ログレベルを設定（本番環境ではINFOに設定）
      @logger.level = Rails.env.production? ? Logger::INFO : Logger::DEBUG
      @logger.info("[PlanGenerator] プランジェネレーター初期化: 地区=#{districts}, 日付=#{date}, 予算=#{budget}, 開始時間=#{start_time}, 終了時間=#{end_time}")
      @districts = districts
      @date = Date.parse(date)
      @member_info = member_info
      @budget = budget
      @start_time = start_time ? Time.parse(start_time) : Time.parse("#{date} 09:00")
      @end_time = end_time ? Time.parse(end_time) : Time.parse("#{date} 21:00")
      @custom_options = custom_options || {}
      @total_available_time = (@end_time - @start_time) / 60 # 分単位
    end

    def generate
      begin
        @logger.info("プラン生成処理を開始")

        # 1. スポットのフィルタリング
        @logger.info("ステップ1: スポットのフィルタリング")
        filtered_spots = filter_spots
        @logger.info("フィルタリング後のスポット数: #{filtered_spots.count}")
        @logger.debug("フィルタリングされたスポット: #{filtered_spots.map(&:spot_name).join(', ')}")

        if filtered_spots.empty?
          @logger.error("フィルタリング後にスポットが見つかりませんでした。フィルタ条件を確認してください。")
          return nil
        end

        # 2. スポットのスコアリング
        @logger.info("ステップ2: スポットのスコアリング")
        scored_spots = score_spots(filtered_spots)
        @logger.info("スコアリングされたスポット数: #{scored_spots.count}")
        @logger.debug("上位5件のスコアリングされたスポット: #{scored_spots.take(5).map { |s| "#{s[:spot].spot_name} (スコア: #{s[:score]})" }.join(', ')}")

        # 3. スポットの選定
        @logger.info("ステップ3: スポットの選定")
        selected_spots = select_spots(scored_spots)
        @logger.info("選定されたスポット数: #{selected_spots.count}")
        @logger.debug("選定されたスポット: #{selected_spots.map(&:spot_name).join(', ')}")

        if selected_spots.empty?
          @logger.error("スポットが選定されませんでした。スコアリングと選定ロジックを確認してください。")
          return nil
        end

        # 4. ルート最適化
        @logger.info("ステップ4: ルート最適化")
        optimized_route = optimize_route(selected_spots)
        @logger.info("最適化されたルートのスポット数: #{optimized_route.count}")
        @logger.debug("最適化されたルート: #{optimized_route.map(&:spot_name).join(' -> ')}")

        # 5. 時間配分
        @logger.info("ステップ5: 時間配分")
        time_allocated_route = allocate_time(optimized_route)
        @logger.info("時間配分されたルートのスポット数: #{time_allocated_route.count}")
        @logger.debug("時間配分: #{time_allocated_route.map { |r| "#{r[:spot].spot_name} (滞在: #{r[:stay_time]}分, 移動: #{r[:travel_time]}分)" }.join(', ')}")

        # 6. プラン生成
        @logger.info("ステップ6: プラン生成")
        plan = create_plan(time_allocated_route)

        if plan.nil?
          @logger.error("プラン生成に失敗しました")
          return nil
        end

        @logger.info("プラン生成成功: #{plan.plan_name}")
        @logger.debug("プラン詳細: #{plan.plan_details.count}ステップ")

        return plan
      rescue => e
        @logger.error("generate メソッドでエラー発生: #{e.message}")
        @logger.error(e.backtrace.join("\n"))
        return nil
      end
    end

    private

    # 1. スポットのフィルタリング
    def filter_spots
      begin
        @logger.info("filter_spotsメソッドを開始")

        # 基本クエリ
        query = Spot.all
        @logger.info("初期クエリのスポット数: #{query.count}")

        # 地区によるフィルタリング
        if @districts.present?
          @logger.info("地区によるフィルタリング: #{@districts.inspect}")

          # 数値IDとslugの両方に対応
          district_ids = @districts.map do |district_identifier|
            # 数値IDの場合はそのまま使用
            if district_identifier.is_a?(Integer) || district_identifier.to_i.to_s == district_identifier.to_s
              @logger.debug("地区ID使用: #{district_identifier}")
              district_identifier
            else
              # 文字列（slug）の場合はIDに変換
              district = District.find_by(slug: district_identifier)
              if district
                @logger.debug("スラグ #{district_identifier} に対応する地区ID #{district.id} を発見")
                district.id
              else
                @logger.warn("スラグ #{district_identifier} に対応する地区が見つかりません")
                nil
              end
            end
          end.compact

          @logger.info("解決された地区ID: #{district_ids.inspect}")

          if district_ids.empty?
            @logger.error("有効な地区IDが見つかりません。地区識別子を確認してください。")
            return []
          end

          query = query.where(district_id: district_ids)
          @logger.info("地区フィルタ後のスポット数: #{query.count}")
        end

        # 営業時間によるフィルタリング
        day_of_week = @date.strftime("%a").downcase
        @logger.info("曜日によるフィルタリング: #{day_of_week}")
        @logger.info("時間範囲: #{@start_time.strftime("%H:%M")} - #{@end_time.strftime("%H:%M")}")

        # 営業時間クエリを実行する前に、結合するテーブルに適切なレコードが存在するか確認
        opening_hours_count = OpeningHour.where(day_of_week: '月', is_closed_day: false).count
        @logger.info("#{day_of_week}の利用可能な営業時間レコード数: #{opening_hours_count}")

        if opening_hours_count == 0
          @logger.warn("#{day_of_week}の営業時間が見つかりません")
        end

        begin
          query = query.joins(:opening_hours)
                      .where("opening_hours.day_of_week = ? AND opening_hours.is_closed_day = false", day_of_week)
                      .where("opening_hours.open_time <= ? AND opening_hours.close_time >= ?",
                             @end_time.strftime("%H:%M"), @start_time.strftime("%H:%M"))

          @logger.info("営業時間フィルタ後のスポット数: #{query.count}")
        rescue => e
          @logger.error("営業時間フィルタでエラー発生: #{e.message}")
          @logger.error(e.backtrace.join("\n"))
          # エラーが発生した場合でも処理を続行するため、元のクエリを返す
          return query.distinct
        end

        # 予算によるフィルタリング
        @logger.info("予算範囲: 最小=#{@budget[:min]}, 最大=#{@budget[:max]}")

        begin
          if @budget[:max] <= 5000
            @logger.info("予算レンジでフィルタリング: 安い")
            query = query.where(budget_range: "安い")
          elsif @budget[:max] <= 15000
            @logger.info("予算レンジでフィルタリング: 安い or 普通")
            query = query.where(budget_range: ["安い", "普通"])
          end

          @logger.info("予算フィルタ後のスポット数: #{query.count}")
        rescue => e
          @logger.error("予算フィルタでエラー発生: #{e.message}")
          @logger.error(e.backtrace.join("\n"))
        end

        # カスタムオプションによるフィルタリング
        if @custom_options.present?
          @logger.info("カスタムオプション: #{@custom_options.inspect}")

          # 雨天対応
          if @custom_options[:rainy_day_option]
            @logger.info("雨天対応オプションでフィルタリング")
            query = query.where(is_rainy_ok: true)
            @logger.info("雨天対応フィルタ後のスポット数: #{query.count}")
          end

          # テーマ
          if @custom_options[:theme].present?
            @logger.info("テーマでフィルタリング: #{@custom_options[:theme]}")
            query = query.where(theme: @custom_options[:theme])
            @logger.info("テーマフィルタ後のスポット数: #{query.count}")
          end

          # カテゴリー
          if @custom_options[:categories].present?
            @logger.info("カテゴリーでフィルタリング: #{@custom_options[:categories].inspect}")

            begin
              query = query.joins(:categories).where(categories: { name: @custom_options[:categories] })
              @logger.info("カテゴリーフィルタ後のスポット数: #{query.count}")
            rescue => e
              @logger.error("カテゴリーフィルタでエラー発生: #{e.message}")
              @logger.error(e.backtrace.join("\n"))
            end
          end
        end

        # 重複を除去して結果を返す
        result = query.distinct
        @logger.info("最終的なフィルタリング後のスポット数: #{result.count}")

        # 結果が空の場合、フィルタ条件を緩和することを検討
        if result.empty?
          @logger.warn("現在のフィルタ条件ではスポットが見つかりません。フィルタ条件の緩和を検討してください。")
        end

        return result
      rescue => e
        @logger.error("filter_spotsメソッドでエラー発生: #{e.message}")
        @logger.error(e.backtrace.join("\n"))
        return []
      end
    end

    # 2. スポットのスコアリング
    def score_spots(spots)
      begin
        @logger.info("score_spotsメソッドを開始: #{spots.count}件のスポットをスコアリング")

        scored_spots = spots.map do |spot|
          begin
            score = 0
            @logger.debug("スポット「#{spot.spot_name}」のスコアリングを開始")

            # 基本スコア
            if spot.review_rating
              base_score = spot.review_rating * 10
              score += base_score
              @logger.debug("基本スコア: +#{base_score} (評価: #{spot.review_rating})")
            else
              @logger.debug("基本スコア: +0 (評価なし)")
            end

            # テーマ適合度
            if @custom_options[:theme].present?
              if spot.theme == @custom_options[:theme]
                score += 30 # テーマに合致する場合は大きく加点
                @logger.debug("テーマ適合度: +30 (テーマ「#{@custom_options[:theme]}」に一致)")
              else
                @logger.debug("テーマ適合度: +0 (テーマ「#{spot.theme}」は「#{@custom_options[:theme]}」と不一致)")
              end
            end

            # カテゴリ適合度
            if @custom_options[:categories].present?
              spot_categories = spot.categories.pluck(:name)
              matching_categories = spot_categories & @custom_options[:categories]
              category_score = matching_categories.size * 20
              score += category_score
              @logger.debug("カテゴリ適合度: +#{category_score} (一致カテゴリ: #{matching_categories.join(', ')})")
            end

            # 雨天対応
            if @custom_options[:rainy_day_option]
              if spot.is_rainy_ok
                score += 15 # 雨天対応の場合は加点
                @logger.debug("雨天対応: +15 (雨天対応可)")
              else
                @logger.debug("雨天対応: +0 (雨天対応不可)")
              end
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
            @logger.debug("予算適合度: #{budget_score >= 0 ? '+' : ''}#{budget_score} (予算レンジ: #{spot.budget_range})")

            # 利用メンバー適合度
            if @member_info[:recommended_for_ids].present?
              spot_recommended_fors = spot.recommended_fors.pluck(:id)
              matching_recommended_fors = spot_recommended_fors & @member_info[:recommended_for_ids]
              member_score = matching_recommended_fors.size * 25
              score += member_score
              @logger.debug("利用メンバー適合度: +#{member_score} (一致おすすめ対象: #{matching_recommended_fors.size}件)")
            end

            @logger.debug("スポット「#{spot.spot_name}」の最終スコア: #{score}")
            { spot: spot, score: score }
          rescue => e
            @logger.error("スポット「#{spot.spot_name}」のスコアリングでエラー発生: #{e.message}")
            @logger.error(e.backtrace.join("\n"))
            { spot: spot, score: 0 } # エラーが発生した場合はスコア0として処理を続行
          end
        end

        # スコアの高い順にソート
        sorted_spots = scored_spots.sort_by { |item| -item[:score] }
        @logger.info("スコアリング完了: 上位スコア #{sorted_spots.take(3).map { |s| "#{s[:spot].spot_name} (#{s[:score]}点)" }.join(', ')}")

        return sorted_spots
      rescue => e
        @logger.error("score_spotsメソッドでエラー発生: #{e.message}")
        @logger.error(e.backtrace.join("\n"))
        return spots.map { |spot| { spot: spot, score: 0 } } # エラーが発生した場合は全てスコア0として処理を続行
      end
    end

    # 3. スポットの選定
    def select_spots(scored_spots)
      begin
        @logger.info("select_spotsメソッドを開始")

        # カスタムオプションでスポット数が指定されている場合はその数、そうでなければデフォルト3つ
        spot_count = @custom_options[:spot_count] || 3
        @logger.info("選定するスポット数: #{spot_count}")

        if scored_spots.empty?
          @logger.warn("スコアリングされたスポットが0件です。選定できるスポットがありません。")
          return []
        end

        # スコアの高い順に指定数選択
        selected = scored_spots.take(spot_count)
        @logger.info("選定されたスポット数: #{selected.count}")

        if selected.count < spot_count
          @logger.warn("要求されたスポット数 #{spot_count} に対して、選定できたのは #{selected.count} 件のみです。")
        end

        # 選択されたスポットを返す
        result = selected.map { |item| item[:spot] }
        @logger.debug("選定されたスポット: #{result.map(&:spot_name).join(', ')}")

        return result
      rescue => e
        @logger.error("select_spotsメソッドでエラー発生: #{e.message}")
        @logger.error(e.backtrace.join("\n"))
        return []
      end
    end

    # 4. ルート最適化
    def optimize_route(spots)
      begin
        @logger.info("optimize_routeメソッドを開始: #{spots.count}件のスポットを最適化")

        if spots.empty?
          @logger.warn("最適化するスポットが0件です。空のルートを返します。")
          return []
        end

        # 出発地点が指定されている場合
        if @custom_options[:starting_point].present?
          @logger.info("出発地点が指定されています: #{@custom_options[:starting_point]}")

          # 出発地点をダミースポットとして追加
          start_spot = Spot.new(
            id: 0,
            spot_name: @custom_options[:starting_point],
            address: @custom_options[:starting_point]
          )
          @logger.debug("出発地点をダミースポットとして追加しました")

          # 出発地点を含めたスポットリスト
          all_spots = [start_spot] + spots
          @logger.debug("全スポット数（出発地点含む）: #{all_spots.count}")

          # 距離行列を計算（実際の実装ではGoogle Maps APIなどを使用）
          @logger.debug("距離行列を計算中...")
          distances = calculate_distance_matrix(all_spots)

          # TSP（巡回セールスマン問題）を解く
          @logger.debug("TSP（巡回セールスマン問題）を解いています...")
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
          @logger.debug("ルート計算完了: #{route.join(' -> ')}")

          # ルートをスポットの配列に変換
          route_spots = route.map { |i| all_spots[i] }

          # 出発地点を除外（最初と最後）
          route_spots = route_spots[1...-1]
          @logger.info("最適化されたルート（出発地点除く）: #{route_spots.map(&:spot_name).join(' -> ')}")
        else
          @logger.info("出発地点が指定されていません。元の順序を維持します。")

          # 出発地点が指定されていない場合は単純に距離行列を計算
          distances = calculate_distance_matrix(spots)

          # 最も効率的な順序を決定（簡易的な実装）
          # 実際の実装ではTSPアルゴリズムを使用
          route_spots = spots
          @logger.debug("最適化されたルート: #{route_spots.map(&:spot_name).join(' -> ')}")
        end

        return route_spots
      rescue => e
        @logger.error("optimize_routeメソッドでエラー発生: #{e.message}")
        @logger.error(e.backtrace.join("\n"))
        return spots # エラーが発生した場合は元のスポットリストをそのまま返す
      end
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
      begin
        @logger.info("allocate_timeメソッドを開始: #{route_spots.count}件のスポットに時間配分")

        if route_spots.empty?
          @logger.warn("時間配分するスポットが0件です。空の配列を返します。")
          return []
        end

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
        @logger.debug("デフォルト滞在時間設定: #{default_stay_times.inspect}")

        # 移動時間を計算（実際の実装ではGoogle Maps APIなどを使用）
        @logger.debug("移動時間を計算中...")
        travel_times = []
        (0...route_spots.size-1).each do |i|
          # 移動手段に応じた移動時間を計算
          travel_method = @custom_options[:transportation_method] || 'car'
          travel_time = calculate_travel_time(route_spots[i], route_spots[i+1], travel_method)
          travel_times << travel_time
          @logger.debug("#{route_spots[i].spot_name} から #{route_spots[i+1].spot_name} への移動時間: #{travel_time}分 (#{travel_method})")
        end

        # 各スポットの滞在時間を決定
        @logger.debug("各スポットの滞在時間を決定中...")
        stay_times = route_spots.map do |spot|
          # スポットのカテゴリに基づいて滞在時間を決定
          category = spot.categories.first&.name || 'default'
          stay_time = default_stay_times[category] || default_stay_times['default']
          @logger.debug("#{spot.spot_name} の滞在時間: #{stay_time}分 (カテゴリ: #{category})")
          stay_time
        end

        # 総所要時間を計算
        total_time = stay_times.sum + travel_times.sum
        @logger.info("総所要時間: #{total_time}分 (滞在時間: #{stay_times.sum}分, 移動時間: #{travel_times.sum}分)")
        @logger.info("利用可能時間: #{@total_available_time}分")

        # 利用可能時間を超える場合は調整
        if total_time > @total_available_time
          @logger.info("総所要時間が利用可能時間を超えるため、滞在時間を調整します")
          # 滞在時間を比例配分で調整
          adjustment_ratio = (@total_available_time - travel_times.sum) / stay_times.sum.to_f
          @logger.debug("調整比率: #{adjustment_ratio}")

          original_stay_times = stay_times.dup
          stay_times = stay_times.map { |time| (time * adjustment_ratio).to_i }

          # 調整前後の滞在時間をログに出力
          route_spots.each_with_index do |spot, i|
            @logger.debug("#{spot.spot_name} の滞在時間: #{original_stay_times[i]}分 -> #{stay_times[i]}分")
          end

          @logger.info("調整後の総所要時間: #{stay_times.sum + travel_times.sum}分")
        end

        # 時間配分情報を含むルート情報を作成
        @logger.debug("ルート情報を作成中...")
        route_with_times = []
        route_spots.each_with_index do |spot, i|
          route_with_times << {
            spot: spot,
            stay_time: stay_times[i],
            travel_time: i < route_spots.size - 1 ? travel_times[i] : nil,
            travel_method: @custom_options[:transportation_method] || 'car'
          }
        end

        @logger.info("時間配分完了: #{route_with_times.count}件のスポット")
        return route_with_times
      rescue => e
        @logger.error("allocate_timeメソッドでエラー発生: #{e.message}")
        @logger.error(e.backtrace.join("\n"))

        # エラーが発生した場合でも最低限の情報を返す
        return route_spots.map do |spot|
          {
            spot: spot,
            stay_time: 60, # デフォルト値
            travel_time: 15, # デフォルト値
            travel_method: 'car'
          }
        end
      end
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
      begin
        @logger.info("create_planメソッドを開始: #{route_with_times.count}件のスポットでプラン生成")

        if route_with_times.empty?
          @logger.error("プラン生成するスポットが0件です。プランを生成できません。")
          return nil
        end

        # プラン名を生成
        @logger.debug("プラン名を生成中...")
        # IDまたはslugから地区名を取得
        district_names = @districts.map do |district_identifier|
          begin
            if district_identifier.is_a?(Integer) || district_identifier.to_i.to_s == district_identifier.to_s
              district = District.find_by(id: district_identifier)
              if district
                @logger.debug("地区ID #{district_identifier} に対応する地区名: #{district.district_name}")
                district.district_name
              else
                @logger.warn("地区ID #{district_identifier} に対応する地区が見つかりません")
                nil
              end
            else
              district = District.find_by(slug: district_identifier)
              if district
                @logger.debug("スラグ #{district_identifier} に対応する地区名: #{district.district_name}")
                district.district_name
              else
                @logger.warn("スラグ #{district_identifier} に対応する地区が見つかりません")
                nil
              end
            end
          rescue => e
            @logger.error("地区名取得でエラー発生: #{e.message}")
            nil
          end
        end.compact.join('・')

        @logger.debug("地区名: #{district_names}")

        # テーマ名を取得
        begin
          theme_name = if @custom_options[:theme].present?
            theme_option = Resolvers::ThemeOptionsResolver.new.resolve.find { |t| t[:id] == @custom_options[:theme] }
            if theme_option
              @logger.debug("テーマID #{@custom_options[:theme]} に対応するテーマ名: #{theme_option[:label]}")
              theme_option[:label]
            else
              @logger.warn("テーマID #{@custom_options[:theme]} に対応するテーマが見つかりません")
              '遊び'
            end
          else
            '遊び'
          end
          @logger.debug("テーマ名: #{theme_name}")
        rescue => e
          @logger.error("テーマ名取得でエラー発生: #{e.message}")
          theme_name = '遊び'
        end

        # プラン名を設定
        plan_name = "#{district_names}の#{theme_name}プラン"
        @logger.info("プラン名: #{plan_name}")

        # 総予算を計算（予算レンジから概算）
        @logger.debug("総予算を計算中...")
        budget_values = {
          "安い" => 3000,
          "普通" => 8000,
          "高い" => 15000
        }

        begin
          total_budget = route_with_times.sum do |item|
            budget = budget_values[item[:spot].budget_range] || budget_values["普通"]
            @logger.debug("スポット「#{item[:spot].spot_name}」の予算: #{budget}円 (#{item[:spot].budget_range})")
            budget
          end
          @logger.info("総予算: #{total_budget}円")
        rescue => e
          @logger.error("予算計算でエラー発生: #{e.message}")
          total_budget = 10000 # デフォルト値
        end

        # 開始・終了時間を計算
        @logger.debug("開始・終了時間を計算中...")
        current_time = @start_time
        end_datetime = current_time

        begin
          route_with_times.each_with_index do |item, i|
            # スポット滞在
            stay_time_sec = item[:stay_time] * 60
            @logger.debug("スポット#{i+1}「#{item[:spot].spot_name}」滞在時間: #{item[:stay_time]}分")
            current_time += stay_time_sec # 秒に変換

            # 移動
            if item[:travel_time]
              travel_time_sec = item[:travel_time] * 60
              @logger.debug("スポット#{i+1}からの移動時間: #{item[:travel_time]}分")
              current_time += travel_time_sec # 秒に変換
            end

            end_datetime = current_time
          end

          @logger.info("プラン開始時間: #{@start_time.strftime('%Y-%m-%d %H:%M')}")
          @logger.info("プラン終了時間: #{end_datetime.strftime('%Y-%m-%d %H:%M')}")
        rescue => e
          @logger.error("時間計算でエラー発生: #{e.message}")
          end_datetime = @start_time + 4.hours # デフォルト値
        end

        # PlayPlanを作成
        @logger.debug("PlayPlanオブジェクトを作成中...")
        begin
          play_plan = PlayPlan.create!(
            plan_name: plan_name,
            description: "#{@date.strftime('%Y年%m月%d日')}の#{plan_name}です。",
            status: 'draft',
            start_datetime: @start_time.in_time_zone('Asia/Tokyo').iso8601,
            end_datetime: end_datetime.in_time_zone('Asia/Tokyo').iso8601,
            total_budget: total_budget,
            trip_type: 'day_trip'
          )
          @logger.debug("PlayPlanオブジェクト作成成功")
        rescue => e
          @logger.error("PlayPlanオブジェクト作成でエラー発生: #{e.message}")
          @logger.error(e.backtrace.join("\n"))
          return nil
        end

        # PlanDetailとTravelDetailを作成
        @logger.debug("PlanDetailとTravelDetailを作成中...")
        current_time = @start_time

        begin
          route_with_times.each_with_index do |item, index|
            @logger.debug("スポット#{index+1}「#{item[:spot].spot_name}」の詳細を作成中...")

            # スポット滞在の開始・終了時間
            stay_start = current_time
            stay_end = current_time + item[:stay_time] * 60
            current_time = stay_end

            # 予算を設定（予算レンジから概算）
            spot_budget = budget_values[item[:spot].budget_range] || budget_values["普通"]

            # PlanDetailを作成
            begin
              plan_detail = play_plan.plan_details.create!(
                step_number: index + 1,
                step_name: item[:spot].spot_name,
                step_description: item[:spot].catchphrase,
                spot: item[:spot],
                start_datetime: stay_start,
                end_datetime: stay_end,
                budget: spot_budget
              )
              @logger.debug("PlanDetail作成成功: #{plan_detail.step_name}")

              # 移動がある場合はTravelDetailを作成
              if item[:travel_time]
                travel_start = stay_end
                travel_end = travel_start + item[:travel_time] * 60
                current_time = travel_end

                travel_detail = plan_detail.travel_details.create!(
                  sequence_number: 1,
                  travel_method: item[:travel_method],
                  travel_time: item[:travel_time]
                )
                @logger.debug("TravelDetail作成成功: #{item[:travel_method]}, #{item[:travel_time]}分")
              end
            rescue => e
              @logger.error("PlanDetail/TravelDetail作成でエラー発生: #{e.message}")
            end
          end

          @logger.info("プラン詳細作成完了: #{play_plan.plan_details.count}ステップ")
        rescue => e
          @logger.error("プラン詳細作成でエラー発生: #{e.message}")
          @logger.error(e.backtrace.join("\n"))
        end

        # 旅行ルート情報を作成
        @logger.debug("旅行ルート情報を作成中...")
        begin
          travel_route = create_travel_route(route_with_times)
          @logger.debug("旅行ルート情報作成成功: 総距離=#{travel_route.total_distance}km, 総移動時間=#{travel_route.total_travel_time}分")

          # プランに旅行ルート情報を追加
          play_plan.instance_variable_set(:@travel_route, travel_route)

          # travel_routeメソッドを動的に追加
          def play_plan.travel_route
            @travel_route
          end
        rescue => e
          @logger.error("旅行ルート情報作成でエラー発生: #{e.message}")
          @logger.error(e.backtrace.join("\n"))
        end

        @logger.info("プラン生成完了: #{play_plan.plan_name}")
        # プランを返す（実際の実装では保存も行う）
        return play_plan
      rescue => e
        @logger.error("create_planメソッドでエラー発生: #{e.message}")
        @logger.error(e.backtrace.join("\n"))
        return nil
      end
    end

    # 旅行ルート情報を作成
    def create_travel_route(route_with_times)
      begin
        @logger.debug("create_travel_routeメソッドを開始: #{route_with_times.count}件のスポットでルート情報作成")

        if route_with_times.empty?
          @logger.warn("ルート情報を作成するスポットが0件です。空のルート情報を返します。")
          return OpenStruct.new(
            total_distance: 0,
            total_travel_time: 0,
            travel_segments: []
          )
        end

        # 総移動時間を計算
        total_travel_time = route_with_times.sum { |item| item[:travel_time] || 0 }
        @logger.debug("総移動時間: #{total_travel_time}分")

        # 旅行セグメントを作成
        @logger.debug("旅行セグメントを作成中...")
        travel_segments = []

        (0...route_with_times.size-1).each do |i|
          begin
            from_spot = route_with_times[i][:spot]
            to_spot = route_with_times[i+1][:spot]
            travel_time = route_with_times[i][:travel_time]
            travel_method = route_with_times[i][:travel_method]

            # ダミーの距離を計算（実際の実装ではGoogle Maps APIなどを使用）
            distance = travel_time * 0.5 # 時間（分）× 0.5km/分 = 距離（km）

            @logger.debug("セグメント#{i+1}: #{from_spot.spot_name} -> #{to_spot.spot_name}, 距離: #{distance}km, 時間: #{travel_time}分, 移動手段: #{travel_method}")

            # OpenStruct（または独自クラス）を使用してセグメントを作成
            segment = OpenStruct.new(
              from_spot: from_spot,
              to_spot: to_spot,
              distance: distance,
              travel_time: travel_time,
              travel_method: travel_method
            )

            travel_segments << segment
          rescue => e
            @logger.error("セグメント#{i+1}作成でエラー発生: #{e.message}")
          end
        end

        @logger.info("作成されたセグメント数: #{travel_segments.count}")

        # 総距離を計算
        total_distance = travel_segments.sum { |segment| segment.distance || 0 }
        @logger.debug("総距離: #{total_distance}km")

        # OpenStruct（または独自クラス）を使用して旅行ルート情報を作成
        route_info = OpenStruct.new(
          total_distance: total_distance,
          total_travel_time: total_travel_time,
          travel_segments: travel_segments
        )

        @logger.info("旅行ルート情報作成完了: 総距離=#{total_distance}km, 総移動時間=#{total_travel_time}分")
        return route_info
      rescue => e
        @logger.error("create_travel_routeメソッドでエラー発生: #{e.message}")
        @logger.error(e.backtrace.join("\n"))

        # エラーが発生した場合でも最低限の情報を返す
        return OpenStruct.new(
          total_distance: 0,
          total_travel_time: 0,
          travel_segments: []
        )
      end
    end
  end
end
