# UpdatePlayPlanWithDetails Mutation 設計書

## 概要

既存の `updatePlayPlan` Mutation を拡張し、プラン詳細（PlanDetail）の作成・更新・削除を一括で行える新しい Mutation を実装しました。

## 機能要件

### 主要機能

1. **更新 (UPDATE)**: `planDetails` に `id` が含まれており、DB上に存在する場合 → 更新処理
2. **新規作成 (CREATE)**: `planDetails` に `id` が含まれていない場合 → 新規作成
3. **削除 (DELETE)**: `deletedPlanDetailIds` に含まれるIDを削除
4. **トランザクション処理**: 全ての操作を一括でトランザクション内で実行
5. **バリデーション**: エラーは `errors` 配列で返却

### 技術要件

- Rails GraphQL Mutation として実装
- ActiveRecord トランザクションを使用
- 包括的なエラーハンドリング
- テストコードによる品質保証

## 実装構成

### ファイル構成

```
backend/
├── app/
│   ├── graphql/
│   │   ├── mutations/
│   │   │   └── update_play_plan_with_details.rb
│   │   └── types/
│   │       └── mutation_type.rb (更新)
│   └── services/
│       └── update_play_plan_with_details_service.rb
└── spec/
    ├── graphql/
    │   └── mutations/
    │       └── update_play_plan_with_details_spec.rb
    └── services/
        └── update_play_plan_with_details_service_spec.rb
```

## GraphQL スキーマ

### Mutation 定義

```graphql
type Mutation {
  updatePlayPlanWithDetails(
    id: ID!
    planName: String
    description: String
    status: StatusEnumType
    tripType: TripTypeEnum
    totalBudget: Float
    location: String
    startDatetime: ISO8601DateTime
    endDatetime: ISO8601DateTime
    imageUrl: String
    tags: String
    recommendUsers: [ID!]
    planDetails: [PlanDetailInputType!]
    deletedPlanDetailIds: [ID!]
    departure: String
    departureTime: ISO8601Time
    travelMethodToFirstSpot: String
    travelTimeToFirstSpot: Int
  ): UpdatePlayPlanWithDetailsPayload!
}
```

### レスポンス型

```graphql
type UpdatePlayPlanWithDetailsPayload {
  playPlan: PlayPlanType
  errors: [FieldErrorType!]!
  success: Boolean!
}
```

## 使用例

### 1. プラン基本情報のみ更新

```graphql
mutation {
  updatePlayPlanWithDetails(
    id: "1"
    planName: "更新されたプラン名"
    description: "更新された説明"
    status: PUBLISHED
  ) {
    playPlan {
      id
      planName
      description
      status
    }
    errors {
      field
      message
    }
    success
  }
}
```

### 2. 集合場所・時間・移動情報を含むプラン更新

```graphql
mutation {
  updatePlayPlanWithDetails(
    id: "1"
    planName: "福岡観光プラン"
    departure: "博多駅"
    departureTime: "09:00"
    travelMethodToFirstSpot: "電車"
    travelTimeToFirstSpot: 15
  ) {
    playPlan {
      id
      planName
      departure
      departureTime
      travelMethodToFirstSpot
      travelTimeToFirstSpot
    }
    errors {
      field
      message
    }
    success
  }
}
```

### 2. プラン詳細の作成・更新・削除を同時実行

```graphql
mutation {
  updatePlayPlanWithDetails(
    id: "1"
    planName: "一括更新プラン"
    planDetails: [
      {
        id: "2"  # 既存のプラン詳細を更新
        stepNumber: 2
        stepName: "更新されたステップ2"
        stepDescription: "更新された説明2"
        budget: 4000.0
      }
      {
        # idなし = 新規作成
        stepNumber: 3
        stepName: "新しいステップ3"
        stepDescription: "新しい説明3"
        budget: 5000.0
      }
    ]
    deletedPlanDetailIds: ["1"]  # プラン詳細ID:1を削除
  ) {
    playPlan {
      id
      planName
      planDetails {
        id
        stepNumber
        stepName
        stepDescription
        budget
      }
    }
    errors {
      field
      message
    }
    success
  }
}
```

## レスポンスサンプル

### 成功時のレスポンス

```json
{
  "data": {
    "updatePlayPlanWithDetails": {
      "playPlan": {
        "id": "1",
        "planName": "一括更新プラン",
        "description": "更新された説明",
        "status": "PUBLISHED",
        "tripType": "DAY_TRIP",
        "totalBudget": 9000.0,
        "location": "福岡市",
        "startDatetime": "2024-01-01T10:00:00Z",
        "endDatetime": "2024-01-01T18:00:00Z",
        "imageUrl": "https://example.com/image.jpg",
        "tags": "観光,グルメ",
        "planDetails": [
          {
            "id": "2",
            "stepNumber": 2,
            "stepName": "更新されたステップ2",
            "stepDescription": "更新された説明2",
            "budget": 4000.0,
            "startDatetime": "2024-01-01T12:00:00Z",
            "endDatetime": "2024-01-01T14:00:00Z"
          },
          {
            "id": "3",
            "stepNumber": 3,
            "stepName": "新しいステップ3",
            "stepDescription": "新しい説明3",
            "budget": 5000.0,
            "startDatetime": "2024-01-01T15:00:00Z",
            "endDatetime": "2024-01-01T17:00:00Z"
          }
        ]
      },
      "errors": [],
      "success": true
    }
  }
}
```

### エラー時のレスポンス

```json
{
  "data": {
    "updatePlayPlanWithDetails": {
      "playPlan": null,
      "errors": [
        {
          "field": "plan_details[0].step_name",
          "message": "ステップ名は必須です"
        },
        {
          "field": "deleted_plan_detail_ids",
          "message": "削除対象のプラン詳細が見つかりません: 999"
        }
      ],
      "success": false
    }
  }
}
```

## バリデーション

### プラン基本情報

- `id`: 必須、存在するプランIDである必要がある
- `planName`: 任意、指定時は空文字不可
- その他フィールド: 任意

### プラン詳細

- `stepNumber`: 必須、重複不可
- `stepName`: 必須、空文字不可
- `spotId`: 任意、指定時は存在するスポットIDである必要がある
- `startDatetime` / `endDatetime`: 任意、指定時は開始時間 < 終了時間である必要がある

### 削除対象ID

- `deletedPlanDetailIds`: 任意、指定時は存在するプラン詳細IDである必要がある

## エラーハンドリング

### エラーの種類

1. **バリデーションエラー**: フィールド単位でエラーメッセージを返却
2. **存在チェックエラー**: 指定されたIDが存在しない場合
3. **権限エラー**: ユーザーが操作権限を持たない場合（実装時にコメントアウト）
4. **システムエラー**: 予期しないエラーが発生した場合

### エラーレスポンス形式

```ruby
{
  field: "エラーが発生したフィールド名",
  message: "エラーメッセージ"
}
```

## トランザクション処理

### 処理フロー

1. **PlayPlan の取得と更新**
2. **PlanDetail の削除処理**
3. **PlanDetail の作成・更新処理**
4. **バリデーション**
5. **エラーがある場合はロールバック**

### ロールバック条件

- バリデーションエラーが発生した場合
- データベース制約違反が発生した場合
- 予期しない例外が発生した場合

## パフォーマンス考慮事項

### 最適化ポイント

1. **N+1問題の回避**: 関連データの事前読み込み（`includes`）
2. **バッチ処理**: 削除処理は一括で実行
3. **インデックス活用**: `step_number` や `plan_id` でのクエリ最適化

### 監視ポイント

1. **実行時間**: 大量のプラン詳細を処理する場合の性能
2. **メモリ使用量**: 関連データの読み込み量
3. **ロック競合**: 同時更新時の競合状況

## セキュリティ考慮事項

### 認証・認可

- 現在のユーザー情報を `context[:current_user]` から取得
- プラン所有者チェック（実装時にコメントアウト、必要に応じて有効化）

### 入力値検証

- GraphQL スキーマレベルでの型チェック
- サービス層での詳細なバリデーション
- SQLインジェクション対策（ActiveRecord使用）

## テスト戦略

### テストカバレッジ

1. **GraphQL Mutation テスト**: エンドツーエンドのテスト
2. **サービス層テスト**: ビジネスロジックの詳細テスト
3. **エラーケーステスト**: 各種エラー条件のテスト
4. **トランザクションテスト**: ロールバック動作の確認

### テスト観点

- 正常系: 各操作（作成・更新・削除）の動作確認
- 異常系: バリデーションエラー、存在チェックエラー
- 境界値: 大量データ、空データでの動作
- 並行性: 同時実行時の整合性

## 運用考慮事項

### ログ出力

- 各操作（作成・更新・削除）の実行ログ
- エラー発生時の詳細ログ
- パフォーマンス監視用のログ

### モニタリング

- 実行回数・成功率の監視
- 実行時間の監視
- エラー率の監視

## 今後の拡張予定

### 機能拡張

1. **TravelDetail の一括操作**: 移動詳細の作成・更新・削除
2. **画像アップロード**: プラン画像の一括処理
3. **バッチ処理**: 複数プランの一括更新

### パフォーマンス改善

1. **非同期処理**: 重い処理の非同期化
2. **キャッシュ活用**: 頻繁にアクセスされるデータのキャッシュ
3. **データベース最適化**: インデックスの追加・最適化

## 関連ドキュメント

- [PlayPlan モデル設計](./design.md)
- [GraphQL API 設計](./design.md)
- [テスト戦略](./design.md)
