# 日本語コメント記述ガイドライン

## 目的
本ガイドラインは、福岡遊びアプリケーションのコードベースにおける日本語コメントの記述方法を統一し、コードの可読性と保守性を向上させることを目的とします。

---

## 基本方針

### 1. コメントは日本語で記述する
- すべてのコメントは日本語で記述します
- 変数名やメソッド名は英語（またはローマ字）のままで問題ありません
- 技術用語は適宜英語を併記します

### 2. コメントすべき箇所
- クラスやモジュールの先頭
- すべてのpublicメソッド
- 複雑なロジックや処理
- 今後の改善が必要な箇所（TODO）
- バグや問題の回避策

### 3. コメント不要な箇所
- 自明な処理
- メソッド名や変数名から明らかに理解できる処理

---

## クラス・モジュールのコメント

### テンプレート

```ruby
# [クラス名]の説明
# [詳細な説明]
# [使用例（必要に応じて）]
class ClassName
  # ...
end
```

### 例

```ruby
# プラン自動生成サービスのメインクラス
# 検索条件に基づいてスポットを検索し、最適なプランを生成する
# 各処理は専用のサービスクラスに委譲され、このクラスは全体のオーケストレーションを担当する
class PlanGenerator
  # ...
end
```

---

## メソッドのコメント

### テンプレート

```ruby
# [メソッドの目的]
# @param [型] 引数名 - 引数の説明
# @return [型] 戻り値の説明
# @raise [例外クラス] 例外が発生する条件
# [補足説明（必要に応じて）]
def method_name(param1, param2)
  # ...
end
```

### 例

```ruby
# スポットのフィルタリング処理を実行
# @param districts [Array<String|Integer>] 地区ID または slug の配列
# @param date [Date] 検索対象日
# @param start_time [Time] 開始時刻
# @param end_time [Time] 終了時刻
# @param budget [Hash] 予算情報（min, max）
# @param custom_options [Hash] カスタムオプション
# @param user [User, nil] 現在のユーザー（プレミアム機能の判定に使用）
# @return [ActiveRecord::Relation] フィルタリングされたスポットのクエリ
# @raise [StandardError] プレミアム機能を非課金ユーザーが使用した場合
def filter(districts:, date:, start_time:, end_time:, budget:, custom_options: {}, user: nil)
  # ...
end
```

---

## インラインコメント

### 基本ルール
- 複雑なロジックや理解しづらい処理に付与
- コードの「なぜ」を説明（「何を」はコードで明らか）
- 簡潔に、1〜2行で記述

### 例

```ruby
# 基本クエリ
query = Spot.all

# 地区によるフィルタリング
query = filter_by_districts(query, districts)

# 営業時間によるフィルタリング
query = filter_by_opening_hours(query, date, start_time, end_time)

# 重複を除去して結果を返す
query.distinct
```

---

## TODOコメント

### テンプレート

```ruby
# TODO: [改善内容]
# [理由や対応方針]
```

### 例

```ruby
# TODO: 実際の実装ではGoogle Maps APIなどを使用して実際の距離や移動時間を取得
# 現在はダミー実装（ランダムな移動時間）
def calculate_distance_matrix(spots)
  # ...
end
```

---

## 定数のコメント

### テンプレート

```ruby
# [定数の説明]
CONSTANT_NAME = value
```

### 例

```ruby
# デフォルトの滞在時間（分）
# カテゴリごとに適切な滞在時間を設定
DEFAULT_STAY_TIMES = {
  'cafe' => 60,
  'restaurant' => 90,
  'museum' => 120
}.freeze
```

---

## 複雑なロジックのコメント

### before（悪い例）

```ruby
def score_spots(spots)
  spots.map do |spot|
    score = 0
    score += spot.review_rating * 10 if spot.review_rating
    score += 30 if @custom_options[:theme].present? && spot.theme == @custom_options[:theme]
    { spot: spot, score: score }
  end.sort_by { |item| -item[:score] }
end
```

### after（良い例）

```ruby
# スポットのスコアリング処理を実行
# @param spots [Array<Spot>] スコアリング対象のスポット配列
# @param custom_options [Hash] カスタムオプション
# @param member_info [Hash] メンバー情報
# @return [Array<Hash>] スコア付きスポット情報の配列（スコアの高い順）
def score_spots(spots, custom_options: {}, member_info: {})
  spots.map do |spot|
    score = 0

    # 基本スコア（レビュー評価: 最大50点）
    score += spot.review_rating * 10 if spot.review_rating

    # テーマ適合度（30点）
    if custom_options[:theme].present? && spot.theme == custom_options[:theme]
      score += 30
    end

    { spot: spot, score: score }
  end.sort_by { |item| -item[:score] } # スコアの高い順にソート
end
```

---

## エラーハンドリングのコメント

### テンプレート

```ruby
rescue 例外クラス => e
  # エラーの説明とハンドリング方法
end
```

### 例

```ruby
begin
  generated_plan = plan_generator.generate
  { plan: generated_plan, errors: [] }
rescue InvalidSearchParametersError => e
  # バリデーションエラーの場合、詳細情報を含むエラーレスポンスを返す
  handle_validation_error(e)
rescue InsufficientSpotsError => e
  # スポット不足エラーの場合、ユーザーに条件緩和を促す
  { plan: nil, errors: [e.message] }
rescue PlanGenerationError => e
  # プラン生成エラー（プレミアム機能エラーを含む）
  { plan: nil, errors: [e.message] }
rescue StandardError => e
  # 予期しないエラーの場合、ログに記録して汎用エラーメッセージを返す
  Rails.logger.error("プラン生成中に予期しないエラーが発生しました: #{e.message}")
  { plan: nil, errors: [I18n.t('errors.plan_generation.internal_error')] }
end
```

---

## 型の表記

### Rubyの場合

```ruby
# @param [String] name - 名前
# @param [Integer] age - 年齢
# @param [Boolean] active - アクティブフラグ
# @param [Array<String>] tags - タグの配列
# @param [Hash] options - オプション
# @param [Symbol] status - ステータス
# @param [User, nil] user - ユーザー（nilの場合あり）
# @return [Array<Hash>] 結果の配列
```

### TypeScript/JavaScriptの場合

```typescript
/**
 * 検索パラメータの状態管理を行うカスタムフック
 * @returns {Object} フック結果
 * @returns {SearchParams} returns.searchParams - 現在の検索パラメータ
 * @returns {Function} returns.updateSearchParams - パラメータ更新関数
 */
export const useSearchParams = () => {
  // ...
}
```

---

## アルゴリズムの説明

### テンプレート

```ruby
# [アルゴリズム名]
# 
# アルゴリズム概要:
# 1. [ステップ1]
# 2. [ステップ2]
# 3. [ステップ3]
# 
# 計算量: O(n)
# 備考: [特記事項]
def algorithm_method
  # ...
end
```

### 例

```ruby
# 貪欲法で最適ルートを計算
# TSP（巡回セールスマン問題）の簡易解法
# 
# アルゴリズム概要:
# 1. 出発地点（インデックス0）から開始
# 2. 現在地から最も近いスポットを次の訪問先として選択
# 3. すべてのスポットを訪問するまで繰り返す
# 4. 出発地点に戻る
# 
# 計算量: O(n^2)
# 備考: 最適解を保証しない近似解法
def calculate_greedy_route(spot_count, distances)
  # ...
end
```

---

## ベストプラクティス

### 1. 簡潔に書く
❌ 悪い例:
```ruby
# この関数は、ユーザーが入力した検索パラメータを受け取り、それらのパラメータが正しい形式であるかどうかをチェックし、問題がある場合はエラーを発生させます
def validate_params
```

✅ 良い例:
```ruby
# 検索パラメータのバリデーションを実行
# @raise [InvalidSearchParametersError] パラメータが不正な場合
def validate_params
```

### 2. 技術用語は適宜英語を併記
```ruby
# TSP（巡回セールスマン問題）を解く
```

### 3. コードで明らかなことは書かない
❌ 悪い例:
```ruby
# iに1を加える
i += 1
```

✅ 良い例:
```ruby
# スポット数をインクリメント
spot_count += 1
```

### 4. 重要な制約や前提条件を明記
```ruby
# スポット数を決定
# @param custom_options [Hash] カスタムオプション
# @return [Integer] スポット数（1〜10の範囲）
# @note 範囲外の値は自動的に1または10に調整される
def determine_spot_count(custom_options)
```

---

## チェックリスト

コードレビュー時に以下を確認:

- [ ] すべてのクラスに説明コメントがあるか
- [ ] すべてのpublicメソッドに説明コメントがあるか
- [ ] パラメータと戻り値が明記されているか
- [ ] 例外が発生する条件が明記されているか
- [ ] 複雑なロジックに説明があるか
- [ ] TODOには理由と対応方針が書かれているか
- [ ] 日本語として読みやすいか
- [ ] 技術用語が適切に使われているか

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2025-11-25 | 1.0 | 初版作成 |
