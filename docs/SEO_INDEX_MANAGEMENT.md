# SEO インデックス管理機能

## 概要

スポット、プラン、イベント、ニュースのSEOインデックス状態を一覧で管理できる機能です。

## 機能

- スポット・プラン・イベント・ニュースのインデックス状態を一覧表示
- フィルタ機能（コンテンツ種別、検索エンジン登録、公開ステータス）
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
- `play_plans.is_public` (boolean, default: false)
- `events.is_indexable` (boolean, default: true)
- `news.is_indexable` (boolean, default: true)

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
query GetSeoIndexList($type: String, $isIndexable: Boolean, $status: StatusEnum) {
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

- `type`: フィルタ対象のレコード種別 (`spot` | `plan` | `event` | `news`)
- `isIndexable`: is_indexableでフィルタ (`true` | `false`)
- `status`: ステータスでフィルタ (`PUBLISHED` | `DRAFT` | `ARCHIVED` | `DELETED`)

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
- `db/migrate/20260214020000_add_is_public_to_play_plans.rb` - PlayPlan is_public マイグレーション
- `db/migrate/20260214020001_add_is_indexable_to_events.rb` - Event マイグレーション
- `db/migrate/20260214020002_add_is_indexable_to_news.rb` - News マイグレーション
- `app/graphql/types/seo_index_row_type.rb` - GraphQL 型定義
- `app/graphql/resolvers/seo_index_list_resolver.rb` - リゾルバー
- `app/graphql/types/query_type.rb` - クエリ追加
- `app/graphql/types/event_type.rb` - Event型に is_indexable 追加
- `app/graphql/types/news_type.rb` - News型に is_indexable 追加
- `app/graphql/types/play_plan_type.rb` - PlayPlan型に is_public 追加
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
- イベント: `{FRONTEND_URL}/events/{id}`
- ニュース: `{FRONTEND_URL}/news/{id}`

デフォルトの `FRONTEND_URL` は `http://localhost:8200` です。
本番環境では環境変数で設定してください。

## 実装の特徴

### Backend

- **is_publicの統一**: すべてのコンテンツタイプで `is_public` を使用（Spot, PlayPlan）
- **StatusEnum使用**: GraphQLクエリで StatusEnum を使用し、型安全性を確保
- **status値保証**: 必ず有効なステータス値を返却（nullを許容しない）
- **拡張性**: Events, News を含む4種類のコンテンツタイプに対応

### Admin UI

- **型安全**: GraphQL Code Generator で生成された型を使用
- **Enum活用**: StatusEnum を使用し、文字列マジックナンバーを排除
- **関数化**: type-to-label mapping を関数として実装し、拡張性を確保
- **日本語ラベル**: ユーザーフレンドリーなラベル名（コンテンツ種別、検索エンジン登録など）
- **コメント**: 実装意図を明確にするコメントを追加

## トラブルシューティング

### 型生成が失敗する

バックエンドサーバーが起動していることを確認してください：

```bash
curl http://localhost:3000/graphql
```

### データが表示されない

1. マイグレーションが実行されているか確認
2. GraphQL クエリが正しく動作しているか GraphiQL で確認 (http://localhost:3000/graphiql)

### TypeScriptのエラーが出る

GraphQL Code Generator を実行して型を生成してください：

```bash
cd admin
npm run generate
```
