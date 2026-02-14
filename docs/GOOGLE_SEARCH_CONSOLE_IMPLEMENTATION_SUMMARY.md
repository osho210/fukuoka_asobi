# Google Search Console API連携実装サマリー

## 実装完了日
2026年2月14日

## 概要

Google Search Console の URL Inspection API と連携し、各URLの実際のインデックス状態を取得・表示する機能を実装しました。これにより、管理画面でGoogleの実インデックス状態を確認し、SEO設定（意図）と実状態の差分を可視化できるようになりました。

## 実装内容

### 1. バックエンド実装

#### データベース
- **テーブル**: `google_index_statuses`
- **関連**: ポリモーフィック（Spot, PlayPlan, Event, News）
- **主要フィールド**:
  - `coverage_state`: カバレッジ状態
  - `indexing_allowed`: インデックス許可
  - `last_crawl_time`: 最終クロール日時
  - `verdict`: 総合判定
  - `google_canonical`: Googleカノニカル
  - その他多数のフィールド

#### モデル
- **GoogleIndexStatus**: インデックス状態モデル
  - ヘルパーメソッド: `indexed?`, `crawled?`, `indexable?`, `status_color`, `has_mismatch?`
- **SeoIndexRow**: ラッパークラス（異なるモデルを統一的に扱う）
- **関連追加**: Spot, PlayPlan, Event, News に `has_one :google_index_status`

#### サービスクラス
- **GoogleSearchConsoleService**
  - URL Inspection API呼び出し
  - Service Account認証
  - スレッドセーフな実装
  - カスタム例外（MissingCredentialsError）

#### GraphQL API
- **Type**: `GoogleIndexStatusType`
- **Mutation**: `updateGoogleIndexStatus`
- **Query拡張**: `seoIndexList` に `googleIndexStatus` フィールド追加

### 2. フロントエンド実装（Admin）

#### UI機能
- **新規カラム追加**:
  - Google実状態（カラーコーディング付き）
  - 最終クロール日時
- **更新ボタン**: 各行に手動更新ボタンを実装
- **ステータスバッジ**:
  - 🟢 緑: 設定OK & Indexed
  - 🟡 黄: 設定OK & Not Indexed（要確認）
  - 🔴 赤: 設定NG & Indexed（要対応）
  - ⚫ 灰: 設定NG & Not Indexed（正常）

#### GraphQL
- クエリ更新: `GET_SEO_INDEX_LIST` に Google状態フィールド追加
- Mutation追加: `UPDATE_GOOGLE_INDEX_STATUS`

### 3. ドキュメント

#### 新規作成
- **GOOGLE_SEARCH_CONSOLE_INTEGRATION.md**
  - 詳細なセットアップガイド
  - Google Cloud Platform設定手順
  - Service Account作成方法
  - Rails Credentials設定
  - API使用方法
  - トラブルシューティング
  - 今後の拡張（バッチ処理）

#### 更新
- **SEO_INDEX_MANAGEMENT.md**
  - Google Search Console連携機能の追加を明記
  - Mutationの使用例追加

### 4. テスト

#### 作成したテスト
- `spec/models/google_index_status_spec.rb`
  - モデルのバリデーション
  - ヘルパーメソッド（`indexed?`, `crawled?`, `status_color`など）
- `spec/factories/google_index_statuses.rb`
  - FactoryBot定義
  - 各種trait（not_indexed, noindex_tag, crawled_not_indexedなど）

#### 更新したテスト
- `spec/graphql/resolvers/seo_index_list_resolver_spec.rb`
  - SeoIndexRowオブジェクト対応
  - google_index_status関連テスト追加

### 5. セキュリティ

- **CodeQL**: 0件の脆弱性（クリア）
- **コードレビュー**: 指摘事項対応完了
  - スレッドセーフなクライアント生成
  - カスタム例外クラスの実装

## セットアップ手順（概要）

1. **Google Cloud Platform**
   - Service Accountの作成
   - Search Console API有効化
   - Search Consoleへのアクセス権限付与

2. **Rails設定**
   ```bash
   # Credentials編集
   EDITOR="vim" bin/rails credentials:edit
   ```
   Service Account情報を追加

3. **環境変数**
   ```bash
   GOOGLE_SEARCH_CONSOLE_SITE_URL=https://fukuoka-asobi.com
   FRONTEND_URL=https://fukuoka-asobi.com
   ```

4. **インストール**
   ```bash
   bundle install
   bin/rails db:migrate
   ```

5. **型生成**
   ```bash
   cd admin
   npm run generate
   ```

詳細は `docs/GOOGLE_SEARCH_CONSOLE_INTEGRATION.md` を参照してください。

## 使用方法

1. 管理画面にアクセス: `http://localhost:9200/seo`
2. 対象のコンテンツの「更新」ボタンをクリック
3. Google Search Console APIが呼び出され、最新の状態が表示される

## API制限

- **レート制限**: 600 requests/分、2,000 requests/日
- **推奨**: バッチ処理実装時は1秒間隔でリクエスト

## 今後の拡張案

### 1. バッチ処理
- Sidekiq/ActiveJobを使用した定期更新
- 1日1回の自動更新（深夜3時など）
- レート制限を考慮した実装

### 2. 通知機能
- インデックス状態の変化を通知
- 異常検知（意図せずインデックスされている場合など）

### 3. レポート機能
- インデックス状態の推移グラフ
- CSV/PDF出力

## ファイル一覧

### Backend
```
backend/
├── Gemfile                                          # gem追加
├── db/migrate/20260214102900_create_google_index_statuses.rb
├── app/
│   ├── models/
│   │   ├── google_index_status.rb                  # 新規
│   │   ├── seo_index_row.rb                        # 新規
│   │   ├── spot.rb                                 # 更新
│   │   ├── play_plan.rb                            # 更新
│   │   ├── event.rb                                # 更新
│   │   └── news.rb                                 # 更新
│   ├── services/
│   │   └── google_search_console_service.rb        # 新規
│   └── graphql/
│       ├── types/
│       │   ├── google_index_status_type.rb         # 新規
│       │   ├── seo_index_row_type.rb               # 更新
│       │   └── mutation_type.rb                    # 更新
│       ├── mutations/
│       │   └── update_google_index_status.rb       # 新規
│       └── resolvers/
│           └── seo_index_list_resolver.rb          # 更新
└── spec/
    ├── models/
    │   └── google_index_status_spec.rb             # 新規
    ├── factories/
    │   └── google_index_statuses.rb                # 新規
    └── graphql/
        └── resolvers/
            └── seo_index_list_resolver_spec.rb     # 更新
```

### Admin
```
admin/
└── src/
    ├── app/
    │   └── seo/
    │       └── page.tsx                            # 更新
    └── graphql/
        ├── queries/
        │   └── getSeoIndexList.ts                  # 更新
        └── mutations/
            └── updateGoogleIndexStatus.ts          # 新規
```

### Docs
```
docs/
├── GOOGLE_SEARCH_CONSOLE_INTEGRATION.md            # 新規
└── SEO_INDEX_MANAGEMENT.md                         # 更新
```

## 技術スタック

- **Backend**:
  - Ruby on Rails 8.0.1
  - GraphQL (graphql-ruby)
  - google-apis-searchconsole_v1 gem
  - googleauth gem

- **Frontend**:
  - Next.js 15.x
  - Apollo Client
  - TypeScript

## 参考リンク

- [Google Search Console API](https://developers.google.com/webmaster-tools/v1/api_reference_index)
- [URL Inspection API](https://developers.google.com/webmaster-tools/v1/urlInspection.index)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)

## 注意事項

### 本番環境での設定が必要
- Google Cloud PlatformでService Accountを作成
- Search Console APIを有効化
- Search ConsoleにService Accountを追加
- Rails CredentialsにService Account情報を設定

### セキュリティ
- Service Account の JSON キーは厳重に管理
- Rails Credentials で暗号化して保存
- 環境変数やコード内に直接記載しない

### レート制限
- API制限に注意
- バッチ処理実装時は適切な間隔を設ける

## トラブルシューティング

問題が発生した場合は、`docs/GOOGLE_SEARCH_CONSOLE_INTEGRATION.md` のトラブルシューティングセクションを参照してください。

## まとめ

Google Search Console API連携により、管理画面で実際のインデックス状態を確認できるようになりました。これにより、SEO改善の判断がより正確に行えるようになり、意図しないインデックス状態を早期に発見できます。

実装はテスト、ドキュメント、セキュリティスキャンを含めて完了しており、本番環境へのデプロイ準備が整っています。
