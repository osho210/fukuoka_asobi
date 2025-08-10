# 遊びプラン一括編集・作成機能 設計書

## 1. 要件定義

### 1.1 機能概要
管理画面から PlayPlan（プラン本体）と PlanDetail（プランのステップ詳細）、TravelDetail（移動詳細）を一括で編集・更新・新規作成できる機能を提供する。

### 1.2 編集・作成可能な要素

#### PlayPlan 情報
- タイトル（plan_name）
- 説明（description）
- 画像（image_url）- 単一または複数想定
- タグ（tags）
- 期間（start_datetime・end_datetime）
- 総予算（total_budget）
- ステータス（status: 公開／下書き）
- 作成者ユーザー情報（user_id）
- 旅行タイプ（trip_type: 日帰り／泊まり）
- おすすめ対象（recommended_fors）

#### PlanDetail 情報
- ステップ番号（step_number）
- ステップ名（step_name）
- ステップ説明（step_description）
- スポット（spot_id）
- コメント（comment）
- 予算（budget）
- 備考（notes）
- 開始・終了日時（start_datetime・end_datetime）

#### TravelDetail 情報
- 移動順序（sequence_number）
- 移動方法（travel_method）
- 移動時間（travel_time）
- メモ（notes）

### 1.3 機能要件
- 画像アップロード機能（Minio/S3 連携想定）
- スポットの入れ替え、移動情報の編集
- 一括トランザクション処理
- バリデーション機能
- エラーハンドリング

## 2. 設計書

### 2.1 概略設計

#### アーキテクチャ
```
管理画面（Next.js）
    ↓ GraphQL
バックエンド（Rails）
    ↓ Service Layer
データベース（MySQL）
    ↓ 画像保存
Minio/S3
```

#### 処理フロー
1. 管理画面でプラン情報入力
2. GraphQL Mutation経由でデータ送信
3. サービス層で一括処理・バリデーション
4. トランザクション内で DB 更新
5. 画像アップロード処理
6. 結果を管理画面に返却

### 2.2 機能設計

#### 2.2.1 GraphQL Schema

**新規 Mutation: `CreateOrUpdatePlayPlanWithDetails`**

```graphql
input PlanDetailInput {
  id: ID
  stepNumber: Int!
  stepName: String!
  stepDescription: String
  spotId: ID
  comment: String
  startDatetime: ISO8601DateTime
  endDatetime: ISO8601DateTime
  budget: Float
  notes: String
  travelDetails: [TravelDetailInput!]
}

input TravelDetailInput {
  id: ID
  sequenceNumber: Int!
  travelMethod: String!
  travelTime: Int
  notes: String
}

input PlayPlanWithDetailsInput {
  id: ID
  planName: String!
  description: String
  status: StatusEnum!
  tripType: TripTypeEnum!
  totalBudget: Float
  location: String
  startDatetime: ISO8601DateTime
  endDatetime: ISO8601DateTime
  imageUrl: String
  tags: String
  recommendUsers: [ID!]
  planDetails: [PlanDetailInput!]!
}

type CreateOrUpdatePlayPlanWithDetailsPayload {
  playPlan: PlayPlanType
  errors: [FieldError!]!
  success: Boolean!
}

type FieldError {
  field: String!
  message: String!
}
```

#### 2.2.2 サービス層設計

**PlayPlanWithDetailsService**

```ruby
class PlayPlanWithDetailsService
  def initialize(params, current_user = nil)
    @params = params
    @current_user = current_user
    @errors = []
  end

  def execute
    ActiveRecord::Base.transaction do
      # 1. PlayPlan の作成・更新
      process_play_plan!

      # 2. PlanDetail の作成・更新・削除
      process_plan_details!

      # 3. TravelDetail の作成・更新・削除
      process_travel_details!

      # 4. 画像処理
      process_images!

      # 5. バリデーション
      validate_all!

      raise ActiveRecord::Rollback if @errors.any?
    end

    build_response
  end

  private

  def process_play_plan!
    # PlayPlan の作成・更新ロジック
  end

  def process_plan_details!
    # PlanDetail の CRUD ロジック
  end

  def process_travel_details!
    # TravelDetail の CRUD ロジック
  end

  def process_images!
    # 画像アップロード・削除ロジック
  end

  def validate_all!
    # 全体バリデーション
  end
end
```

#### 2.2.3 バリデーション設計

**PlayPlan バリデーション**
- plan_name: 必須、255文字以内
- status: 必須、enum値
- trip_type: 必須、enum値
- start_datetime < end_datetime（両方存在する場合）
- total_budget: 正の数値

**PlanDetail バリデーション**
- step_number: 必須、正の整数、同一プラン内で重複なし
- step_name: 必須、255文字以内
- start_datetime < end_datetime（両方存在する場合）
- budget: 正の数値
- spot_id: 存在するスポットID

**TravelDetail バリデーション**
- sequence_number: 必須、正の整数、同一PlanDetail内で重複なし
- travel_method: 必須、enum値（徒歩、電車、車、自転車、その他）
- travel_time: 正の整数

**全体バリデーション**
- ステップ間の時間整合性チェック
- 総予算と各ステップ予算の整合性

### 2.3 クラス構成

#### バックエンド
```
app/
├── graphql/
│   ├── mutations/
│   │   └── create_or_update_play_plan_with_details.rb
│   └── types/
│       ├── play_plan_with_details_input_type.rb
│       ├── plan_detail_input_type.rb
│       ├── travel_detail_input_type.rb
│       └── field_error_type.rb
├── services/
│   ├── play_plan_with_details_service.rb
│   ├── image_upload_service.rb
│   └── plan_validation_service.rb
└── models/
    ├── play_plan.rb（既存）
    ├── plan_detail.rb（既存）
    └── travel_detail.rb（既存）
```

#### フロントエンド
```
admin/src/
├── app/
│   └── play_plans/
│       ├── page.tsx（一覧画面）
│       ├── new/
│       │   └── page.tsx（新規作成画面）
│       └── [id]/
│           └── edit/
│               └── page.tsx（編集画面）
├── components/
│   ├── forms/
│   │   ├── PlayPlanForm.tsx
│   │   ├── PlanDetailForm.tsx
│   │   └── TravelDetailForm.tsx
│   └── ui/
│       ├── ImageUploader.tsx
│       └── StepManager.tsx
└── graphql/
    ├── mutations/
    │   └── createOrUpdatePlayPlanWithDetails.ts
    └── queries/
        └── getPlayPlanWithDetails.ts
```

## 3. 画像管理設計

### 3.1 アップロード方式
- Base64 または multipart upload 対応
- Minio/S3 への保存
- 既存画像の差し替え時は古い画像を削除

### 3.2 ImageUploadService
```ruby
class ImageUploadService
  def upload(image_data, old_image_url = nil)
    # 1. 画像データの検証
    # 2. S3/Minioへのアップロード
    # 3. 古い画像の削除
    # 4. 新しいimage_urlを返却
  end
end
```

## 4. エラーハンドリング

### 4.1 エラー形式
```json
{
  "errors": [
    {
      "field": "planDetails[1].stepNumber",
      "message": "ステップ番号が重複しています"
    },
    {
      "field": "image",
      "message": "画像のアップロードに失敗しました"
    }
  ]
}
```

### 4.2 トランザクション
- PlayPlan、PlanDetail、TravelDetail の更新は一括トランザクション
- いずれかが失敗した場合はロールバック
- 部分的成功は行わない

## 5. 管理画面UI設計

### 5.1 画面構成
1. **プラン一覧画面** (`/admin/play_plans`)
   - プラン一覧表示
   - 新規作成ボタン
   - 編集・削除ボタン

2. **プラン作成・編集画面** (`/admin/play_plans/new`, `/admin/play_plans/[id]/edit`)
   - PlayPlan基本情報入力フォーム
   - PlanDetail動的追加・編集フォーム
   - TravelDetail入力フォーム
   - 画像アップロード機能
   - プレビュー機能

### 5.2 主要コンポーネント
- **PlayPlanForm**: プラン基本情報入力
- **StepManager**: ステップの動的追加・削除・並び替え
- **PlanDetailForm**: 各ステップの詳細入力
- **TravelDetailForm**: 移動詳細入力
- **ImageUploader**: 画像アップロード
