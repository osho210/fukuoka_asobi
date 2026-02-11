# SEO インデックス管理機能

## 概要

スポットとプランのSEOインデックス状態を一覧で管理できる機能です。

## 機能

- スポット・プランのインデックス状態を一覧表示
- フィルタ機能（種別、is_indexable、ステータス）
- URL クリックで対象ページへ遷移
- 更新日時の降順でソート

## セットアップ

### 1. データベースマイグレーション

```bash
cd backend
bin/rails db:migrate
```

これにより、以下のカラムが追加されます：
- `spots.is_indexable` (boolean, default: true)
- `play_plans.is_indexable` (boolean, default: true)

### 2. GraphQL 型の生成

バックエンドサーバーを起動してから、以下のコマンドを実行してください：

```bash
# バックエンドを起動（別ターミナル）
cd backend
bin/rails server -p 3000

# 型生成
cd admin
npm run generate
```

### 3. 管理画面へのアクセス

管理画面を起動後、以下のURLにアクセスします：

```
http://localhost:9200/seo
```

## GraphQL API

### Query: seoIndexList

```graphql
query GetSeoIndexList($type: String, $isIndexable: Boolean, $status: String) {
  seoIndexList(type: $type, isIndexable: $isIndexable, status: $status) {
    id
    title
    type
    status
    isIndexable
    url
    updatedAt
  }
}
```

#### 引数

- `type`: フィルタ対象のレコード種別 (`spot` | `plan`)
- `isIndexable`: is_indexableでフィルタ (`true` | `false`)
- `status`: ステータスでフィルタ (`published` | `draft` | `archived`)

## テスト

### Backend

```bash
cd backend
bundle exec rspec spec/graphql/resolvers/seo_index_list_resolver_spec.rb
bundle exec rspec spec/graphql/types/seo_index_row_type_spec.rb
```

### Admin (要バックエンド起動)

```bash
cd admin
npm run dev
# ブラウザで http://localhost:9200/seo にアクセスして動作確認
```

## ファイル構成

### Backend

- `db/migrate/20260211154840_add_is_indexable_to_spots.rb` - Spot マイグレーション
- `db/migrate/20260211154841_add_is_indexable_to_play_plans.rb` - PlayPlan マイグレーション
- `app/graphql/types/seo_index_row_type.rb` - GraphQL 型定義
- `app/graphql/resolvers/seo_index_list_resolver.rb` - リゾルバー
- `app/graphql/types/query_type.rb` - クエリ追加
- `spec/graphql/resolvers/seo_index_list_resolver_spec.rb` - テスト
- `spec/graphql/types/seo_index_row_type_spec.rb` - テスト

### Admin

- `src/app/seo/page.tsx` - SEO 管理画面
- `src/graphql/queries/getSeoIndexList.ts` - GraphQL クエリ
- `src/styles/admin.css` - バッジスタイル追加

## 仕様

### インデックス想定の判定ロジック

`index` として表示される条件：
- `is_indexable = true` かつ `status = published`

それ以外は `noindex` として表示されます。

### URL 生成

- スポット: `{FRONTEND_URL}/spots/{id}`
- プラン: `{FRONTEND_URL}/play_plans/{id}`

デフォルトの `FRONTEND_URL` は `http://localhost:8200` です。
本番環境では環境変数で設定してください。

## トラブルシューティング

### 型生成が失敗する

バックエンドサーバーが起動していることを確認してください：

```bash
curl http://localhost:3000/graphql
```

### データが表示されない

1. マイグレーションが実行されているか確認
2. GraphQL クエリが正しく動作しているか GraphiQL で確認 (http://localhost:3000/graphiql)
