# 検索エンジン公開制御機能の実装

## 概要

spots と play_plans に検索エンジンへの公開制御機能を追加しました。
この機能により、未完成コンテンツ・下書き・検証用データが検索結果に表示されることを防ぎます。

## 実装内容

### 1. データベース変更

#### play_plans テーブル
新しいカラム `is_public` を追加:
- デフォルト値: `true`
- 説明: 検索エンジンインデックス公開フラグ

**マイグレーションファイル**: `backend/db/migrate/20260211154600_add_is_public_to_play_plans.rb`

#### spots テーブル
既存の `is_public` カラムを利用（すでに実装済み）

### 2. バックエンド (Ruby on Rails / GraphQL)

#### 変更ファイル:
1. **GraphQL Type** (`backend/app/graphql/types/play_plan_type.rb`)
   - `is_public` フィールドを追加

2. **GraphQL Mutation** (`backend/app/graphql/mutations/create_or_update_play_plan_with_details.rb`)
   - `is_public` 引数を追加（オプショナル）

### 3. フロントエンド (Next.js)

#### 変更ファイル:
1. **GraphQL クエリ**
   - `frontend/src/graphql/queries/getSpot.ts`: `isPublic` フィールド追加
   - `frontend/src/graphql/playPlans.ts`: `isPublic` フィールド追加（GET_PLAY_PLANS, GET_PLAY_PLAN）

2. **詳細ページ（Server Components + generateMetadata）**
   - `frontend/src/app/spots/[id]/page.tsx`: 
     - Server Component に変更
     - `generateMetadata` で is_public に基づいて robots メタタグを設定
   - `frontend/src/app/plans/[id]/page.tsx`: 
     - Server Component に変更
     - `generateMetadata` で is_public に基づいて robots メタタグを設定

**技術的詳細:**
- Next.js 15 App Router の `generateMetadata` を使用
- サーバー側で GraphQL API を fetch し、is_public を確認
- is_public が false の場合、`robots: { index: false, follow: false }` を設定
- これにより、サーバーレンダリング時に robots メタタグが HTML に含まれる

### 4. 管理画面 (Admin)

#### 変更ファイル:
1. **フォーム** (`admin/src/components/forms/PlayPlanForm.tsx`)
   - `isPublic` チェックボックス追加
   - 「検索エンジンに公開」オプション

2. **ページ**
   - `admin/src/app/play_plans/new/page.tsx`: `isPublic` デフォルト値設定
   - `admin/src/app/play_plans/[id]/edit/page.tsx`: `isPublic` データ送受信

3. **モデル定数** (`admin/src/lib/modelConstants.ts`)
   - play_plans モデルに `isPublic` フィールド追加（動的フォーム対応）

4. **GraphQL クエリ**
   - `admin/src/graphql/queries/getPlayPlans.ts`: `isPublic`, `isRecommended` フィールド追加

## 動作確認手順

### 前提条件
1. バックエンドが起動していること
2. npm パッケージがインストールされていること

### 手順

#### 1. マイグレーション実行
```bash
cd backend
bin/rails db:migrate
```

#### 2. GraphQL型生成
```bash
# フロントエンド
cd frontend
npm run generate

# 管理画面
cd admin
npm run generate
```

#### 3. 動作確認

##### 管理画面での確認:
1. `http://localhost:9200/play_plans/new` にアクセス
2. 新規プラン作成画面で「検索エンジンに公開」チェックボックスを確認
3. チェックを外して保存
4. 編集画面で設定が保存されていることを確認

##### フロントエンドでの確認:
1. `is_public = false` のスポット/プランページにアクセス
2. ブラウザの開発者ツールで `<head>` を確認
3. `<meta name="robots" content="noindex, nofollow">` が追加されていることを確認

##### 検証コマンド:
```bash
# HTML ソースを確認（サーバーレンダリング時に含まれる）
curl -s http://localhost:8200/spots/[id] | grep -i "robots"
curl -s http://localhost:8200/plans/[id] | grep -i "robots"

# 期待される出力（is_public = false の場合）:
# <meta name="robots" content="noindex, nofollow"/>
```

## SEO への影響

### is_public = true (デフォルト)
- 検索エンジンにインデックスされる
- 通常通り検索結果に表示される

### is_public = false
- `<meta name="robots" content="noindex, nofollow">` が設定される
- 検索エンジンがページをインデックスしない
- 既存のインデックスも時間とともに削除される

## 今後の拡張案

1. **サイトマップ対応**
   - `is_public = false` のページを sitemap.xml から除外
   - 実装ファイル: `frontend/src/app/sitemap.xml.ts` (要新規作成)

2. **一括変更機能**
   - 管理画面で複数のスポット/プランの公開設定を一括変更

3. **公開スケジュール**
   - 公開日時を設定し、自動的に公開/非公開を切り替え

## 注意事項

- **デフォルト値**: 新規作成時は `is_public = true` (公開)
- **既存データ**: マイグレーション実行時、既存の play_plans は `is_public = true` に設定される
- **SSR対応**: robots メタタグはサーバーサイドで生成されるため、検索エンジンが正しく認識できる
- **キャッシュ**: メタデータは60秒ごとに再検証される（Next.js の revalidate 設定）

## テスト

現在のテストは最小限のため、以下のテストの追加を推奨:

1. **バックエンド**: GraphQL mutation のテスト
2. **フロントエンド**: generateMetadata の動作確認テスト
3. **統合テスト**: E2E での robots メタタグ確認（SSR時に含まれることを確認）

## リファレンス

- [Google Search Central - robots メタタグ](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
