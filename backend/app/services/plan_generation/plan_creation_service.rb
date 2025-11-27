# frozen_string_literal: true

require 'ostruct'

module PlanGeneration
  # プラン生成処理を担当するサービスクラス
  # 時間配分されたルート情報から、PlayPlan、PlanDetail、TravelDetailを生成し保存する
  class PlanCreationService
    # 予算レンジごとの概算金額（円）- フォールバック用
    BUDGET_VALUES = {
      "CHEAP" => 3000,
      "AVERAGE" => 8000,
      "EXPENSIVE" => 15000
    }.freeze

    # プラン生成処理を実行
    # @param route_with_times [Array<Hash>] 時間配分情報を含むルート情報
    # @param districts [Array<String|Integer>] 地区ID または slug の配列
    # @param date [Date] プラン実施日
    # @param start_time [Time] 開始時刻
    # @param custom_options [Hash] カスタムオプション
    # @param user [User, nil] ユーザー
    # @return [PlayPlan] 生成されたプラン（travel_route情報を含む）
    def self.create(route_with_times:, districts:, date:, start_time:, custom_options: {}, user: nil)
      # プラン名を生成
      plan_name = generate_plan_name(districts, custom_options)

      # 総予算を計算
      total_budget = calculate_total_budget(route_with_times)

      # 終了時刻を計算
      end_datetime = calculate_end_datetime(start_time, route_with_times)

      # PlayPlanを作成
      play_plan = build_play_plan(
        user: user,
        plan_name: plan_name,
        date: date,
        start_time: start_time,
        end_datetime: end_datetime,
        total_budget: total_budget,
        districts: districts
      )

      # トランザクションでプランとその詳細を保存
      ActiveRecord::Base.transaction do
        play_plan.save!
        create_plan_details(play_plan, route_with_times, start_time)
      end

      # 旅行ルート情報を作成してプランに追加
      travel_route = create_travel_route(route_with_times)
      attach_travel_route(play_plan, travel_route)

      play_plan
    end

    # プラン名を生成
    # @param districts [Array<String|Integer>] 地区ID または slug の配列
    # @param custom_options [Hash] カスタムオプション
    # @return [String] プラン名
    def self.generate_plan_name(districts, custom_options)
      # 地区名を取得（N+1クエリを防ぐため、まとめて取得）
      id_identifiers = districts.select { |d| d.is_a?(Integer) || d.to_i.to_s == d.to_s }.map(&:to_i)
      slug_identifiers = districts.reject { |d| d.is_a?(Integer) || d.to_i.to_s == d.to_s }.map(&:to_s)
      districts_records = District.where(id: id_identifiers).or(District.where(slug: slug_identifiers)).to_a
      # ハッシュを作成して高速に参照
      districts_by_id = districts_records.index_by(&:id)
      districts_by_slug = districts_records.index_by(&:slug)
      district_names = districts.map do |district_identifier|
        if district_identifier.is_a?(Integer) || district_identifier.to_i.to_s == district_identifier.to_s
          districts_by_id[district_identifier.to_i]&.district_name
        else
          districts_by_slug[district_identifier.to_s]&.district_name
        end
      end.compact.join('・')

      # テーマ名を取得
      theme = custom_options[:theme] || custom_options['theme']
      theme_name = if theme.present?
                     Resolvers::ThemeOptionsResolver.new.resolve.find { |t| t[:id] == theme }&.dig(:label)
                   end
      theme_name ||= '遊び'

      # TODO: 将来的にはランダムでプランが生成されるように変更する
      "#{district_names}で#{theme_name}プラン"
    end

    # 総予算を計算
    # @param route_with_times [Array<Hash>] ルート情報
    # @return [Integer] 総予算（円）
    def self.calculate_total_budget(route_with_times)
      route_with_times.sum do |item|
        calculate_spot_budget(item[:spot])
      end
    end

    # スポットの予算を計算
    # price_range_start_amount と price_range_end_amount の平均値を使用
    # これらの値がない場合は budget_range に基づいた固定値を使用
    # @param spot [Spot] スポット
    # @return [Integer] 予算（円）
    def self.calculate_spot_budget(spot)
      if spot.price_range_start_amount.present? && spot.price_range_end_amount.present?
        ((spot.price_range_start_amount + spot.price_range_end_amount) / 2.0).round
      else
        BUDGET_VALUES[spot.budget_range] || BUDGET_VALUES["AVERAGE"]
      end
    end

    # 終了時刻を計算
    # @param start_time [Time] 開始時刻
    # @param route_with_times [Array<Hash>] ルート情報
    # @return [Time] 終了時刻
    def self.calculate_end_datetime(start_time, route_with_times)
      current_time = start_time

      route_with_times.each do |item|
        # スポット滞在時間を加算
        current_time += item[:stay_time] * 60 # 秒に変換

        # 移動時間を加算
        if item[:travel_time]
          current_time += item[:travel_time] * 60 # 秒に変換
        end
      end

      current_time
    end

    # PlayPlanを構築
    # @param user [User, nil] ユーザー
    # @param plan_name [String] プラン名
    # @param date [Date] プラン実施日
    # @param start_time [Time] 開始時刻
    # @param end_datetime [Time] 終了時刻
    # @param total_budget [Integer] 総予算
    # @param districts [Array<String|Integer>] 地区ID または slug の配列
    # @return [PlayPlan] PlayPlanインスタンス（未保存）
    def self.build_play_plan(user:, plan_name:, date:, start_time:, end_datetime:, total_budget:, districts:)
      # 地区名を取得してlocationに設定（N+1クエリを回避）
      id_districts = districts.select { |d| d.is_a?(Integer) || d.to_i.to_s == d.to_s }
      slug_districts = districts.reject { |d| d.is_a?(Integer) || d.to_i.to_s == d.to_s }

      districts_by_id = {}
      if id_districts.any?
        District.where(id: id_districts).find_each do |district|
          districts_by_id[district.id.to_s] = district.district_name
        end
      end

      districts_by_slug = {}
      if slug_districts.any?
        District.where(slug: slug_districts).find_each do |district|
          districts_by_slug[district.slug.to_s] = district.district_name
        end
      end

      location = districts.map do |district_identifier|
        if id_districts.include?(district_identifier)
          districts_by_id[district_identifier.to_s]
        else
          districts_by_slug[district_identifier.to_s]
        end
      end.compact.join('・')

      PlayPlan.new(
        user_id: user&.id,
        plan_name: plan_name,
        description: "#{date.strftime('%Y年%m月%d日')}の#{plan_name}です。",
        status: 'published',
        start_time: start_time,
        end_time: end_datetime,
        total_budget: total_budget,
        trip_type: 'day_trip',
        location: location
      )
    end

    # PlanDetailとTravelDetailを作成
    # @param play_plan [PlayPlan] 保存済みのPlayPlan
    # @param route_with_times [Array<Hash>] ルート情報
    # @param start_time [Time] 開始時刻
    def self.create_plan_details(play_plan, route_with_times, start_time)
      current_time = start_time

      route_with_times.each_with_index do |item, index|
        # スポット滞在の開始・終了時刻
        stay_start = current_time
        stay_end = current_time + item[:stay_time] * 60
        current_time = stay_end

        # 予算を設定
        spot_budget = calculate_spot_budget(item[:spot])

        # PlanDetailを作成して保存
        plan_detail = PlanDetail.create!(
          plan_id: play_plan.id,
          step_number: index + 1,
          step_name: item[:spot].spot_name,
          step_description: item[:spot].catchphrase,
          spot: item[:spot],
          start_time: stay_start,
          end_time: stay_end,
          duration_minutes: item[:stay_time],
          budget: spot_budget
        )

        # 移動がある場合はTravelDetailを作成
        if item[:travel_time]
          create_travel_detail(plan_detail, item, stay_end)
          current_time += item[:travel_time] * 60
        end
      end
    end

    # TravelDetailを作成
    # @param plan_detail [PlanDetail] 関連するPlanDetail
    # @param item [Hash] ルート情報の1項目
    # @param travel_start [Time] 移動開始時刻
    def self.create_travel_detail(plan_detail, item, travel_start)
      # 移動手段を日本語に変換
      japanese_travel_method = convert_travel_method_to_japanese(item[:travel_method])

      TravelDetail.create!(
        plan_detail_id: plan_detail.id,
        sequence_number: 1,
        travel_method: japanese_travel_method,
        travel_time: item[:travel_time]
      )
    end

    # 移動手段を日本語に変換
    # @param travel_method [String] 移動手段（英語または日本語）
    # @return [String] 移動手段（日本語）
    def self.convert_travel_method_to_japanese(travel_method)
      case travel_method
      when 'walk'
        '徒歩'
      when 'car'
        '車'
      when 'train'
        '電車'
      when 'bicycle'
        '自転車'
      else
        travel_method # 既に日本語の場合はそのまま、その他の場合も変換しない
      end
    end

    # 旅行ルート情報を作成
    # @param route_with_times [Array<Hash>] ルート情報
    # @return [OpenStruct] 旅行ルート情報
    def self.create_travel_route(route_with_times)
      # 総移動時間を計算
      total_travel_time = route_with_times.sum { |item| item[:travel_time] || 0 }

      # 旅行セグメントを作成
      travel_segments = []
      (0...route_with_times.size - 1).each do |i|
        from_spot = route_with_times[i][:spot]
        to_spot = route_with_times[i + 1][:spot]
        travel_time = route_with_times[i][:travel_time]
        travel_method = route_with_times[i][:travel_method]

        # ダミーの距離を計算
        # TODO: 実際の実装ではGoogle Maps APIなどを使用
        distance = travel_time * 0.5 # 時間（分）× 0.5km/分 = 距離（km）

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

      OpenStruct.new(
        total_distance: total_distance,
        total_travel_time: total_travel_time,
        travel_segments: travel_segments
      )
    end

    # 旅行ルート情報をプランに追加
    # @param play_plan [PlayPlan] PlayPlan
    # @param travel_route [OpenStruct] 旅行ルート情報
    def self.attach_travel_route(play_plan, travel_route)
      play_plan.instance_variable_set(:@travel_route, travel_route)

      # travel_routeメソッドを動的に追加
      def play_plan.travel_route
        @travel_route
      end
    end

    private_class_method :generate_plan_name, :calculate_total_budget, :calculate_spot_budget,
                         :calculate_end_datetime, :build_play_plan, :create_plan_details,
                         :create_travel_detail, :convert_travel_method_to_japanese,
                         :create_travel_route, :attach_travel_route
  end
end
