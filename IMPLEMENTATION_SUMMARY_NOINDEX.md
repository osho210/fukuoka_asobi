# noindex デフォルトON設計 実装サマリー

## 🎯 目的
新規作成データが意図せず検索結果に出る事故を防ぐため、デフォルトで検索エンジンにインデックスされないようにする。

## 📝 実装内容

### 1. データベース変更

#### マイグレーション
- `20260211160156_add_is_indexable_to_spots.rb`
  - `spots` テーブルに `is_indexable` カラム追加
  - デフォルト値: `false`
  - null制約: `NOT NULL`
  - コメント: "検索エンジンにインデックスさせるかどうか"

- `20260211160157_add_is_indexable_to_play_plans.rb`
  - `play_plans` テーブルに `is_indexable` カラム追加
  - デフォルト値: `false`
  - null制約: `NOT NULL`
  - コメント: "検索エンジンにインデックスさせるかどうか"

### 2. Backend (Rails/GraphQL)

#### GraphQL Types
- `SpotType` (`app/graphql/types/spot_type.rb`)
  - `is_indexable` フィールド追加
  - description: "検索エンジンにインデックスさせるかどうか"

- `PlayPlanType` (`app/graphql/types/play_plan_type.rb`)
  - `is_indexable` フィールド追加
  - description: "検索エンジンにインデックスさせるかどうか"

#### GraphQL Mutations
- `CreateSpot` (`app/graphql/mutations/create_spot.rb`)
  - `is_indexable` 引数追加 (Boolean, required: false)
  - 明示的に `true` が渡されない限り、DBのデフォルト値 `false` が適用される

- `UpdateSpot` (`app/graphql/mutations/update_spot.rb`)
  - `is_indexable` 引数追加 (Boolean, required: false)

- `CreateOrUpdatePlayPlanWithDetails` (`app/graphql/mutations/create_or_update_play_plan_with_details.rb`)
  - `is_indexable` 引数追加 (Boolean, required: false)
  - description: "検索エンジンにインデックスさせるかどうか"

#### テスト
- `spec/models/spot_spec.rb`
  - デフォルト値検証テスト追加
  - `is_indexable` のデフォルト値が `false` であることを確認

- `spec/models/play_plan_spec.rb`
  - デフォルト値検証テスト追加
  - `is_indexable` のデフォルト値が `false` であることを確認

- `spec/graphql/mutations/create_spot_spec.rb`
  - `is_indexable` 未指定時のデフォルト値検証
  - `is_indexable: true` 指定時の動作検証
  - `is_indexable: false` 指定時の動作検証
  - 管理者権限チェック

### 3. Frontend (Next.js)

#### GraphQL クエリ更新
- `frontend/src/graphql/queries/getSpot.ts`
  - `GET_SPOT` クエリに `isIndexable` フィールド追加

- `frontend/src/graphql/playPlans.ts`
  - `GET_PLAY_PLAN` クエリに `isIndexable` フィールド追加

#### メタデータ生成
- `frontend/src/lib/metadata.ts` (新規作成)
  - サーバーサイド専用 Apollo クライアント実装
  - `fetchSpotForMetadata()`: Spot データ取得関数
  - `fetchPlayPlanForMetadata()`: PlayPlan データ取得関数

- `frontend/src/app/spots/[id]/page.tsx`
  - `generateMetadata()` 関数追加
  - `is_indexable === false` の場合: `robots: { index: false, follow: false }` を設定
  - `is_indexable === true` の場合: 通常のメタデータを設定

- `frontend/src/app/plans/[id]/page.tsx`
  - `generateMetadata()` 関数追加
  - `is_indexable === false` の場合: `robots: { index: false, follow: false }` を設定
  - `is_indexable === true` の場合: 通常のメタデータを設定

## 🔍 動作確認

### 新規作成時の挙動
1. **Backend**: 
   - CreateSpot または CreateOrUpdatePlayPlanWithDetails を実行
   - `is_indexable` を指定しない → デフォルトで `false` になる
   
2. **Frontend**:
   - `generateMetadata()` がサーバーサイドで実行される
   - `is_indexable === false` の場合、以下のメタタグが出力される:
   ```html
   <meta name="robots" content="noindex, nofollow">
   ```

### 管理画面で公開する場合
1. **Backend**:
   - UpdateSpot または CreateOrUpdatePlayPlanWithDetails で `is_indexable: true` を指定
   
2. **Frontend**:
   - `generateMetadata()` が通常のメタデータを出力
   - robots メタタグは設定されない (検索エンジンにインデックスされる)

## 📦 デプロイ手順

### 1. DBマイグレーション実行
```bash
cd backend
bin/rails db:migrate
```

### 2. GraphQL Code Generator 実行
```bash
cd frontend
npm run generate
```

### 3. 動作確認
- 新規Spot/PlayPlanを作成し、`is_indexable` が `false` になることを確認
- フロントエンドで該当ページを開き、HTMLソースで `<meta name="robots" content="noindex, nofollow">` が出力されることを確認
- 管理画面で `is_indexable` を `true` に変更し、robots メタタグが消えることを確認

## ⚠️ 注意事項

1. **既存データへの影響**
   - 既存の Spot/PlayPlan は `is_indexable = false` になります
   - 検索エンジンにインデックスさせたい既存データは、管理画面で明示的に `is_indexable = true` に変更してください

2. **is_public との違い**
   - `is_public`: サイト上で公開するかどうか
   - `is_indexable`: 検索エンジンにインデックスさせるかどうか
   - 両方を適切に管理する必要があります

3. **GraphQL Code Generator**
   - フロントエンドの型定義が更新されるため、必ず実行してください
   - 実行しないと TypeScript エラーが発生します

## 🧪 テスト

### Backend
```bash
cd backend
bundle exec rspec spec/models/spot_spec.rb
bundle exec rspec spec/models/play_plan_spec.rb
bundle exec rspec spec/graphql/mutations/create_spot_spec.rb
```

### Frontend
- 手動テスト推奨 (メタデータ生成の確認)
- ブラウザの開発者ツールで `<head>` タグ内の robots メタタグを確認

## 📚 関連ファイル

### Backend
- `backend/db/migrate/20260211160156_add_is_indexable_to_spots.rb`
- `backend/db/migrate/20260211160157_add_is_indexable_to_play_plans.rb`
- `backend/db/schema.rb`
- `backend/app/graphql/types/spot_type.rb`
- `backend/app/graphql/types/play_plan_type.rb`
- `backend/app/graphql/mutations/create_spot.rb`
- `backend/app/graphql/mutations/update_spot.rb`
- `backend/app/graphql/mutations/create_or_update_play_plan_with_details.rb`
- `backend/spec/models/spot_spec.rb`
- `backend/spec/models/play_plan_spec.rb`
- `backend/spec/graphql/mutations/create_spot_spec.rb`

### Frontend
- `frontend/src/lib/metadata.ts`
- `frontend/src/app/spots/[id]/page.tsx`
- `frontend/src/app/plans/[id]/page.tsx`
- `frontend/src/graphql/queries/getSpot.ts`
- `frontend/src/graphql/playPlans.ts`

## ✅ 完了条件の達成状況

- ✅ 新規作成時は `is_indexable = false` (DBデフォルト値)
- ✅ 管理画面で明示的にONにしたもののみ検索公開 (Mutation対応完了)
- ✅ フロントエンドで `is_indexable === false` の場合、`robots: { index: false, follow: false }` を設定 (generateMetadata実装完了)
- ✅ Code review 完了 (コメント反映済み)
- ✅ テスト作成完了

---

**実装完了日**: 2026-02-11
**実装者**: GitHub Copilot Agent
