# プラン自動生成機能 設計書

## 1. 要件定義

### 1.1 概要
ユーザーの希望条件（エリア・予算・移動手段など）に合わせて、遊びプラン（スポットの訪問順序・滞在時間・移動時間など）を自動生成・提案する検索エンジンを実装する。

### 1.2 機能要件
1. **検索条件に基づくスポットのフィルタリング**
   - エリア、営業時間、予算、カテゴリなどの条件でスポットを絞り込む
   - 雨天時は屋内スポットを優先する
   - 課金ユーザーは詳細な検索条件を指定可能

2. **スポットのスコアリングと優先順位付け**
   - テーマ適合度、人気度、距離などでスポットをスコア化
   - ユーザーの条件に合わせて重み付けを調整

3. **ルート最適化**
   - 選択されたスポット間の最適な訪問順序を決定
   - 移動時間を考慮した効率的なルート生成
   - 利用するアルゴリズムはダイクストラ法

4. **時間配分と移動時間の計算**
   - 各スポットの滞在時間を推定
   - スポット間の移動時間を計算
   - 全体の所要時間がユーザー指定の時間内に収まるよう調整

5. **プラン生成と保存**
   - 最適化されたプランをPlayPlanとして生成
   - PlanDetailとTravelDetailを適切に設定
   - 表示するデザインはPlayPlanDetail componentを採用したいので、共通化して利用できる形に変更して下さい

## 2. 設計

### 2.1 全体アーキテクチャ

#### バックエンド（Rails & GraphQL）
- **GraphQLリゾルバ**: 検索条件を受け取り、プラン生成ロジックを呼び出す
- **プラン生成サービス**: スポット選定、ルート最適化、時間配分を行う
- **データアクセス層**: 既存のモデル（PlayPlan, Spot, PlanDetail等）を活用

#### フロントエンド（Next.js）
- **検索フォーム**: 既存のコンポーネントを活用
- **結果表示**: 生成されたプランを視覚的に表示

### 2.2 データフロー
1. ユーザーが検索条件を入力
2. フロントエンドがGraphQLクエリを実行
3. バックエンドでプラン生成ロジックを実行
4. 生成されたプランをレスポンスとして返却
5. フロントエンドで結果を表示

### 2.3 バックエンド詳細設計

#### 2.3.1 GraphQLスキーマ拡張
既存のスキーマを拡張し、プラン生成に必要な入力型と出力型を定義する。

```ruby
# 入力型（既存のものを活用）
# Types::GenderInputType
# Types::BudgetInputType
# Types::CustomOptionsInputType

# 出力型
module Types
  class GeneratedPlanType < Types::BaseObject
    field :id, ID, null: false
    field :plan_name, String, null: false
    field :description, String, null: true
    field :total_budget, Float, null: true
    field :start_datetime, GraphQL::Types::ISO8601DateTime, null: true
    field :end_datetime, GraphQL::Types::ISO8601DateTime, null: true
    field :plan_details, [Types::PlanDetailType], null: false
    field :travel_route, Types::TravelRouteType, null: false
  end

  class TravelRouteType < Types::BaseObject
    field :total_distance, Float, null: true
    field :total_travel_time, Integer, null: true
    field :travel_segments, [Types::TravelSegmentType], null: false
  end

  class TravelSegmentType < Types::BaseObject
    field :from_spot, Types::SpotType, null: false
    field :to_spot, Types::SpotType, null: false
    field :distance, Float, null: true
    field :travel_time, Integer, null: true
    field :travel_method, String, null: false
  end
end
```

#### 2.3.2 リゾルバの実装
既存の`SearchPlansResolver`を拡張し、プラン生成ロジックを追加する。

```ruby
module Resolvers
  class GeneratePlanResolver < Resolvers::BaseResolver
    type Types::GeneratedPlanType, null: false
    description "検索条件に基づいてプランを自動生成"

    argument :areas, [ID], required: true, description: "エリアID"
    argument :date, String, required: true, description: "日付（YYYY-MM-DD形式）"
    argument :member_info, Types::MemberInfoInputType, required: true, description: "利用メンバー情報"
    argument :budget, Types::BudgetInputType, required: true, description: "予算範囲"
    argument :start_time, String, required: false, description: "開始時間（HH:MM形式）"
    argument :end_time, String, required: false, description: "終了時間（HH:MM形式）"
    argument :custom_options, Types::CustomOptionsInputType, required: false, description: "カスタムオプション"

    def resolve(areas:, date:, member_info:, budget:, start_time: nil, end_time: nil, custom_options: nil)
      # プラン生成サービスを呼び出す
      plan_generator = Services::PlanGenerator.new(
        areas: areas,
        date: date,
        member_info: member_info,
        budget: budget,
        start_time: start_time,
        end_time: end_time,
        custom_options: custom_options
      )

      plan_generator.generate
    end
  end
end
```

#### 2.3.3 プラン生成サービス
プラン生成のコアロジックを実装するサービスクラス。

```ruby
module Services
  class PlanGenerator
    def initialize(areas:, date:, member_info:, budget:, start_time: nil, end_time: nil, custom_options: nil)
      @areas = areas
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

      # エリアによるフィルタリング
      query = query.joins(:areas).where(areas: { id: @areas }) if @areas.present?

      # 営業時間によるフィルタリング
      day_of_week = @date.strftime("%a").downcase
      query = query.joins(:opening_hours)
                  .where("opening_hours.day_of_week = ? AND opening_hours.is_closed_day = false", day_of_week)
                  .where("opening_hours.open_time <= ? AND opening_hours.close_time >= ?",
                         @end_time.strftime("%H:%M"), @start_time.strftime("%H:%M"))

      # 予算によるフィルタリング
      # 注: 予算はスポット単位ではなくプラン全体で考慮するため、ここでは緩めのフィルタリング
      max_spot_budget = @budget[:max] * 0.7 # 1スポットあたりの最大予算を全体の70%と仮定
      query = query.where("budget <= ?", max_spot_budget) if max_spot_budget.present?

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
        if spot.budget.present?
          budget_ratio = spot.budget.to_f / @budget[:max].to_f
          if budget_ratio <= 0.3
            score += 15 # 予算の30%以下なら加点
          elsif budget_ratio > 0.7
            score -= 10 # 予算の70%超なら減点
          end
        end

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
      area_names = Area.where(id: @areas).pluck(:name).join('・')
      theme_name = @custom_options[:theme].present? ?
                  ThemeOptionsResolver.new.resolve.find { |t| t[:id] == @custom_options[:theme] }&.dig(:label) :
                  '遊び'
      plan_name = "#{area_names}で#{theme_name}プラン"

      # 総予算を計算
      total_budget = route_with_times.sum { |item| item[:spot].budget.to_i }

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

        # PlanDetailを作成
        plan_detail = play_plan.plan_details.build(
          step_number: index + 1,
          step_name: item[:spot].spot_name,
          step_description: item[:spot].catchphrase,
          spot: item[:spot],
          start_datetime: stay_start,
          end_datetime: stay_end,
          budget: item[:spot].budget
        )

        # 移動がある場合はTravelDetailを作成
        if item[:travel_time]
          travel_start = stay_end
          travel_end = travel_start + item[:travel_time] * 60
          current_time = travel_end

          plan_detail.travel_details.build(
            sequence_number: 1,
            travel_method: item[:travel_method],
            travel_time: item[:travel_time]
          )
        end
      end

      # プランを返す（実際の実装では保存も行う）
      play_plan
    end
  end
end
```

#### 2.3.4 テスト計画
- **ユニットテスト**: 各メソッドの機能を個別にテスト
- **統合テスト**: プラン生成の全体フローをテスト
- **エッジケースのテスト**: 極端な条件での動作確認

### 2.4 フロントエンド詳細設計

#### 2.4.1 GraphQLクエリ
```graphql
mutation GeneratePlan($areas: [ID!]!, $date: String!, $memberInfo: MemberInfoInput!, $budget: BudgetInput!, $startTime: String, $endTime: String, $customOptions: CustomOptionsInput) {
  generatePlan(
    areas: $areas
    date: $date
    memberInfo: $memberInfo
    budget: $budget
    startTime: $startTime
    endTime: $endTime
    customOptions: $customOptions
  ) {
    id
    planName
    description
    totalBudget
    startDatetime
    endDatetime
    planDetails {
      id
      stepNumber
      stepName
      stepDescription
      startDatetime
      endDatetime
      budget
      spot {
        id
        spotName
        address
        catchphrase
        imageUrl
      }
      travelDetails {
        sequenceNumber
        travelMethod
        travelTime
      }
    }
    travelRoute {
      totalDistance
      totalTravelTime
      travelSegments {
        fromSpot {
          id
          spotName
        }
        toSpot {
          id
          spotName
        }
        distance
        travelTime
        travelMethod
      }
    }
  }
}
```

#### 2.4.2 コンポーネント設計
1. **PlanGeneratorContainer**: プラン生成フォームのコンテナコンポーネント
2. **GeneratedPlanView**: 生成されたプランの表示コンポーネント
3. **PlanTimeline**: プランのタイムライン表示コンポーネント
4. **RouteMap**: プランのルートをマップ上に表示するコンポーネント

#### 2.4.3 状態管理
- Apollo Clientのキャッシュを活用
- 必要に応じてReactのuseStateとuseEffectを使用

## 3. 実装計画

### 3.1 バックエンド実装
1. GraphQLスキーマの拡張
2. リゾルバの実装
3. プラン生成サービスの実装
4. テストの実装

### 3.2 フロントエンド実装
1. GraphQLクエリの実装
2. コンポーネントの実装
3. 検索フォームとの連携
4. 結果表示画面の実装

### 3.3 テスト計画
1. バックエンドユニットテスト
2. フロントエンドコンポーネントテスト
3. E2Eテスト

## 4. 技術的考慮事項

### 4.1 パフォーマンス
- スポットデータが多い場合のクエリ最適化
- 距離計算のキャッシュ戦略
- TSP問題の効率的な解法選択

### 4.2 拡張性
- 将来的な検索条件の追加に対応できる設計
- 外部APIとの連携（Google Maps API等）
- 機械学習による推薦システムの導入可能性

### 4.3 制約と課題
- 実際の移動時間データの取得方法
- 営業時間や定休日の例外処理
- 天候情報の取得と反映方法
- 複数日程のプラン対応
