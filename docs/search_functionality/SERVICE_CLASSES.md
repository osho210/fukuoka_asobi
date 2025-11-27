# サービスクラス責務ドキュメント

## 概要
本ドキュメントは、プラン生成機能のバックエンドサービスクラスの責務と役割を定義します。

---

## アーキテクチャ概要

プラン生成機能は、以下の階層構造で実装されています：

```
GraphQL Mutation (generate_plan.rb)
  ↓
PlanGenerator (オーケストレーター)
  ↓
各サービスクラス（単一責任の原則に基づく）
```

---

## サービスクラス一覧

### 1. PlanGenerator
**パス**: `backend/app/services/plan_generator.rb`

#### 責務
- プラン生成処理全体のオーケストレーション
- 各サービスクラスの呼び出し順序の制御
- パラメータのバリデーション実行

#### 主なメソッド
- `initialize`: パラメータの初期化
- `generate`: プラン生成の実行
- `validate_params`: パラメータバリデーションの実行

#### 依存関係
- `SearchParamsValidator`: パラメータバリデーション
- `PlanGeneration::SpotFilterService`: スポットフィルタリング
- `PlanGeneration::SpotScoringService`: スコアリング
- `PlanGeneration::SpotSelectionService`: スポット選定
- `PlanGeneration::RouteOptimizationService`: ルート最適化
- `PlanGeneration::TimeAllocationService`: 時間配分
- `PlanGeneration::PlanCreationService`: プラン生成

#### 処理フロー
1. パラメータのバリデーション
2. スポットのフィルタリング
3. スポットのスコアリング
4. スポットの選定
5. ルート最適化
6. 時間配分
7. プラン生成

---

### 2. SearchParamsValidator
**パス**: `backend/app/services/validators/search_params_validator.rb`

#### 責務
- 検索パラメータの妥当性検証
- 必須項目、範囲、型のチェック
- バリデーションエラーの詳細情報の提供

#### 主なメソッド
- `validate!`: 全パラメータのバリデーション実行
- `validate_date`: 日付のバリデーション
- `validate_districts`: 地区のバリデーション
- `validate_member_info`: メンバー情報のバリデーション
- `validate_budget`: 予算のバリデーション
- `validate_time`: 時刻のバリデーション
- `validate_custom_options`: カスタムオプションのバリデーション

#### エラー処理
- バリデーションエラー時は `InvalidSearchParametersError` を発生
- エラー詳細（フィールド名とエラーメッセージのマップ）を提供

#### バリデーションルール
- **日付**: 過去日付は不可
- **地区**: 最低1つ必要、存在確認
- **メンバー**: 最低1つ必要
- **予算**: min <= max、非負
- **時刻**: startTime < endTime
- **スポット数**: 1 <= spotCount <= 10

---

### 3. PlanGeneration::SpotFilterService
**パス**: `backend/app/services/plan_generation/spot_filter_service.rb`

#### 責務
- 検索条件に基づくスポットのフィルタリング
- プレミアム機能の権限チェック
- データベースクエリの最適化

#### フィルタリング項目
1. **地区**: 指定された地区のスポットのみ
2. **営業時間**: 指定日時に営業しているスポットのみ
3. **予算**: 予算範囲に合うスポットのみ（緩めのフィルタ）
4. **カスタムオプション**:
   - 雨天対応
   - テーマ
   - カテゴリー
5. **プレミアムオプション**:
   - 決済手段（クレジットカード、NFC、現金のみ）
   - 飲食店オプション（朝食、ランチ、ディナー、ベジタリアン、屋外席、子供向け、ペット可）
   - その他（予約可、テイクアウト、デリバリー）

#### エラー処理
- プレミアム機能を非課金ユーザーが使用した場合、`PlanGenerationError` を発生

#### 主なメソッド
- `filter`: フィルタリングの実行
- `filter_by_districts`: 地区によるフィルタリング
- `filter_by_opening_hours`: 営業時間によるフィルタリング
- `filter_by_budget`: 予算によるフィルタリング
- `filter_by_custom_options`: カスタムオプションによるフィルタリング
- `filter_by_premium_options`: プレミアムオプションによるフィルタリング

---

### 4. PlanGeneration::SpotScoringService
**パス**: `backend/app/services/plan_generation/spot_scoring_service.rb`

#### 責務
- フィルタリング済みスポットのスコアリング
- 複数の評価軸に基づくスコア計算
- スコアの高い順にソート

#### スコアリング項目
1. **レビュー評価**: 0〜50点（rating × 10）
2. **テーマ適合度**: 0/30点
3. **カテゴリ適合度**: 0〜∞点（1カテゴリ=20点）
4. **雨天対応**: 0/15点
5. **予算適合度**: -10〜15点
6. **メンバー適合度**: 0〜∞点（1対象=25点）

#### 主なメソッド
- `score`: スコアリングの実行
- `calculate_score`: 個別スポットのスコア計算
- `calculate_review_score`: レビュースコア計算
- `calculate_theme_score`: テーマスコア計算
- `calculate_category_score`: カテゴリスコア計算
- `calculate_rainy_day_score`: 雨天対応スコア計算
- `calculate_budget_score`: 予算スコア計算
- `calculate_member_score`: メンバースコア計算

#### 戻り値
```ruby
[
  { spot: Spot, score: 85 },
  { spot: Spot, score: 70 },
  ...
]
```

---

### 5. PlanGeneration::SpotSelectionService
**パス**: `backend/app/services/plan_generation/spot_selection_service.rb`

#### 責務
- スコア付きスポットから指定数のスポットを選定
- スポット数の決定とバリデーション

#### ロジック
1. スポット数を決定（カスタムオプションまたはデフォルト3）
2. スコアの高い順に指定数を選択
3. スポットが不足している場合はエラー

#### エラー処理
- 必要なスポット数が確保できない場合、`InsufficientSpotsError` を発生

#### 主なメソッド
- `select`: スポット選定の実行
- `determine_spot_count`: スポット数の決定

---

### 6. PlanGeneration::RouteOptimizationService
**パス**: `backend/app/services/plan_generation/route_optimization_service.rb`

#### 責務
- スポット間の移動距離を考慮した最適ルートの決定
- 出発地点を考慮したルート計算
- TSP（巡回セールスマン問題）の簡易解法

#### アルゴリズム
- **出発地点あり**: 貪欲法（最も近いスポットを次の訪問先とする）
- **出発地点なし**: 現在の順序を維持（将来的に最適化予定）

#### 今後の改善予定
- Google Maps APIを使用した実際の距離・移動時間の取得
- より高度なTSPアルゴリズムの導入

#### 主なメソッド
- `optimize`: ルート最適化の実行
- `optimize_with_starting_point`: 出発地点を考慮した最適化
- `create_dummy_spot`: ダミースポットの作成
- `calculate_distance_matrix`: 距離行列の計算（現在はダミー実装）
- `calculate_greedy_route`: 貪欲法によるルート計算

---

### 7. PlanGeneration::TimeAllocationService
**パス**: `backend/app/services/plan_generation/time_allocation_service.rb`

#### 責務
- 各スポットの滞在時間の計算
- スポット間の移動時間の計算
- 利用可能時間内への調整

#### デフォルト滞在時間
- カフェ: 60分
- レストラン: 90分
- 美術館: 120分
- 公園: 90分
- ショッピング: 120分
- 温泉: 120分
- その他: 90分

#### 移動時間の計算
- 移動手段に応じた時間を計算（現在はランダム、将来的にはAPI使用）
  - 徒歩: 15〜45分
  - 車: 5〜20分
  - 電車: 10〜30分
  - 自転車: 10〜25分

#### 時間調整ロジック
1. 総所要時間を計算（滞在時間 + 移動時間）
2. 利用可能時間を超える場合、滞在時間を比例配分で調整

#### 主なメソッド
- `allocate`: 時間配分の実行
- `calculate_stay_times`: 滞在時間の計算
- `calculate_travel_times`: 移動時間の計算
- `calculate_single_travel_time`: 1区間の移動時間計算
- `adjust_stay_times`: 滞在時間の調整
- `build_route_with_times`: 時間配分情報の構築

---

### 8. PlanGeneration::PlanCreationService
**パス**: `backend/app/services/plan_generation/plan_creation_service.rb`

#### 責務
- PlayPlan、PlanDetail、TravelDetailの生成と保存
- プラン名の生成
- 予算の計算
- 旅行ルート情報の作成

#### データベース操作
- **トランザクション管理**: すべての保存をトランザクション内で実行
- **関連データの生成**:
  - PlayPlan（プラン本体）
  - PlanDetail（スポット詳細）
  - TravelDetail（移動詳細）

#### 予算計算
- 予算レンジごとの概算値:
  - CHEAP: 3,000円
  - AVERAGE: 8,000円
  - EXPENSIVE: 15,000円

#### 主なメソッド
- `create`: プラン生成の実行
- `generate_plan_name`: プラン名の生成
- `calculate_total_budget`: 総予算の計算
- `calculate_end_datetime`: 終了時刻の計算
- `build_play_plan`: PlayPlanの構築
- `create_plan_details`: PlanDetailとTravelDetailの作成
- `create_travel_detail`: TravelDetailの作成
- `convert_travel_method_to_japanese`: 移動手段の日本語変換
- `create_travel_route`: 旅行ルート情報の作成
- `attach_travel_route`: 旅行ルート情報のアタッチ

---

## エラークラス

### 1. PlanGenerationError
**パス**: `backend/app/errors/plan_generation_error.rb`

#### 責務
- プラン生成エラーの基底クラス
- エラーコードと詳細情報の保持

#### 属性
- `code`: エラーコード
- `details`: 追加のエラー詳細

---

### 2. InvalidSearchParametersError
**パス**: `backend/app/errors/invalid_search_parameters_error.rb`

#### 責務
- バリデーションエラーの表現
- フィールドごとのエラーメッセージの保持

#### 使用場面
- 検索パラメータが不正な場合
- 必須項目の欠落
- 値の範囲エラー

---

### 3. InsufficientSpotsError
**パス**: `backend/app/errors/insufficient_spots_error.rb`

#### 責務
- スポット不足エラーの表現
- 必要数と実際の数の情報提供

#### 使用場面
- 検索条件に合うスポットが指定数に満たない場合

---

## 設計原則

### 1. 単一責任の原則（SRP）
各サービスクラスは1つの明確な責務のみを持つ

### 2. 依存性逆転の原則（DIP）
PlanGeneratorは具体的なサービスクラスではなく、インターフェースに依存

### 3. オープン・クローズドの原則（OCP）
新しいフィルタリング条件やスコアリング項目は、既存コードを変更せずに追加可能

### 4. インターフェース分離の原則（ISP）
各サービスクラスは必要最小限のメソッドのみを公開

---

## テスト戦略

### 単体テスト
各サービスクラスは独立してテスト可能

### 統合テスト
PlanGeneratorを通じて全体の動作をテスト

### テストケース
1. 正常系: 各種パラメータでのプラン生成成功
2. 異常系: バリデーションエラー、スポット不足、プレミアム権限エラー
3. 境界値: 最小・最大値でのテスト

---

## 今後の拡張性

### 1. 新しいフィルタリング条件の追加
`SpotFilterService` に新しいメソッドを追加

### 2. 新しいスコアリング項目の追加
`SpotScoringService` に新しいスコア計算メソッドを追加

### 3. ルート最適化アルゴリズムの改善
`RouteOptimizationService` の実装を差し替え

### 4. 外部APIの統合
各サービスクラスにAPI呼び出しロジックを追加

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2025-11-25 | 1.0 | 初版作成、6つのサービスクラスに分割 |
