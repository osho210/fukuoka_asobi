# Google Search Console API 連携機能

## 概要

Google Search Console の URL Inspection API と連携し、各URLの実際のインデックス状態を取得・表示する機能です。

## 目的

- Googleに実際に登録されているかどうかを確認可能にする
- SEO設定（意図）と実インデックス状態の差分を可視化
- SEO改善・運用判断を行える管理UIを構築

## 取得する情報

Google URL Inspection API より以下の情報を取得します：

- **インデックス登録有無** (coverage_state)
- **クロール済みか** (last_crawl_time)
- **インデックス可能か** (indexing_allowed)
- **カノニカルURL** (google_canonical, user_canonical)
- **最終クロール日時** (last_crawl_time)
- **総合判定** (verdict: PASS, FAIL, PARTIAL, NEUTRAL)
- **インデックスされていない理由** (coverage_state)
- **モバイルフレンドリー判定** (mobile_friendly_verdict)
- **リッチリザルト情報** (rich_results_items)

## セットアップ

### 1. Google Cloud Platform の設定

#### 1.1. Service Account の作成

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクトを作成または選択
3. 「IAM と管理」→「サービスアカウント」に移動
4. 「サービスアカウントを作成」をクリック
5. サービスアカウント名を入力（例: `fukuoka-asobi-search-console`）
6. 「作成して続行」をクリック
7. ロールは不要なので「続行」をクリック
8. 「完了」をクリック

#### 1.2. Service Account キーの生成

1. 作成したサービスアカウントをクリック
2. 「キー」タブに移動
3. 「鍵を追加」→「新しい鍵を作成」をクリック
4. キーのタイプは「JSON」を選択
5. 「作成」をクリック
6. JSONファイルがダウンロードされます（大切に保管してください）

#### 1.3. Search Console API の有効化

1. [Google Cloud Console](https://console.cloud.google.com/) の「APIとサービス」→「ライブラリ」に移動
2. 「Search Console API」を検索
3. 「有効にする」をクリック

#### 1.4. Search Console へのアクセス権限付与

1. [Google Search Console](https://search.google.com/search-console) にアクセス
2. 対象プロパティを選択
3. 「設定」→「ユーザーと権限」に移動
4. 「ユーザーを追加」をクリック
5. Service Account のメールアドレス（`xxx@xxx.iam.gserviceaccount.com`）を入力
6. 権限レベル「オーナー」または「フル」を選択
7. 「追加」をクリック

### 2. Rails Credentials の設定

#### 2.1. Credentials の編集

```bash
cd backend
EDITOR="vim" bin/rails credentials:edit
```

#### 2.2. Service Account 情報の追加

ダウンロードした JSON ファイルの内容を以下のように追加します：

```yaml
google:
  search_console_service_account:
    type: service_account
    project_id: your-project-id
    private_key_id: your-private-key-id
    private_key: |
      -----BEGIN PRIVATE KEY-----
      YOUR_PRIVATE_KEY_HERE
      -----END PRIVATE KEY-----
    client_email: your-service-account@your-project.iam.gserviceaccount.com
    client_id: your-client-id
    auth_uri: https://accounts.google.com/o/oauth2/auth
    token_uri: https://oauth2.googleapis.com/token
    auth_provider_x509_cert_url: https://www.googleapis.com/oauth2/v1/certs
    client_x509_cert_url: https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com
```

### 3. 環境変数の設定

`.env` または環境変数に以下を設定します：

```bash
# Google Search Console のプロパティURL（デフォルト）
GOOGLE_SEARCH_CONSOLE_SITE_URL=https://fukuoka-asobi.com

# フロントエンドのURL（デフォルト: http://localhost:8200）
FRONTEND_URL=https://fukuoka-asobi.com
```

### 4. Gem のインストール

```bash
cd backend
bundle install
```

これにより、以下の Gem がインストールされます：
- `google-apis-searchconsole_v1`

### 5. データベースマイグレーション

```bash
cd backend
bin/rails db:migrate
```

これにより、`google_index_statuses` テーブルが作成されます。

### 6. GraphQL 型の生成

バックエンドサーバーを起動してから、以下のコマンドを実行してください：

```bash
# バックエンドを起動（別ターミナル）
cd backend
bin/rails server -p 3000

# 型生成
cd admin
npm run generate
```

## 使用方法

### 管理画面での手動更新

1. 管理画面にアクセス: `http://localhost:9200/seo`
2. 対象のコンテンツの行で「更新」ボタンをクリック
3. Google Search Console API が呼び出され、インデックス状態が更新されます
4. 更新が完了すると、「Google実状態」列に最新の状態が表示されます

### ステータスカラーの意味

管理画面の「Google実状態」列は、以下のカラーコードで表示されます：

- 🟢 **緑（Green）**: 設定OK & Indexed
  - `is_indexable=true`, `status=published` で、Googleにインデックス済み
  - 期待通りの状態です
  
- 🟡 **黄（Yellow）**: 設定OK & Not Indexed
  - `is_indexable=true`, `status=published` だが、Googleにインデックスされていない
  - 要注意：サイトマップ送信、robots.txt、noindexタグなどを確認してください
  
- 🔴 **赤（Red）**: 設定NG & Indexed
  - `is_indexable=false` または `status!=published` なのに、Googleにインデックス済み
  - 要対応：意図せずインデックスされている状態です
  
- ⚫ **灰（Gray）**: 設定NG & Not Indexed
  - `is_indexable=false` または `status!=published` で、Googleにインデックスされていない
  - 正常な状態です

### GraphQL API の使用

#### Mutation: updateGoogleIndexStatus

```graphql
mutation UpdateGoogleIndexStatus(
  $indexableType: String!
  $indexableId: ID!
  $siteUrl: String
) {
  updateGoogleIndexStatus(
    indexableType: $indexableType
    indexableId: $indexableId
    siteUrl: $siteUrl
  ) {
    googleIndexStatus {
      id
      inspectedUrl
      coverageState
      crawledAs
      indexingAllowed
      lastCrawlTime
      verdict
      googleCanonical
      userCanonical
      indexed
      crawled
      indexable
      notIndexedReason
      hasMismatch
      statusColor
    }
    errors
  }
}
```

**引数:**
- `indexableType` (必須): レコード種別（`Spot`, `PlayPlan`, `Event`, `News`）
- `indexableId` (必須): レコードID
- `siteUrl` (任意): Search Console プロパティURL（省略時は環境変数から取得）

**使用例:**

```graphql
mutation {
  updateGoogleIndexStatus(
    indexableType: "Spot"
    indexableId: "123"
  ) {
    googleIndexStatus {
      id
      indexed
      coverageState
      lastCrawlTime
    }
    errors
  }
}
```

#### Query: seoIndexList（拡張版）

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
    googleIndexStatus {
      id
      inspectedUrl
      coverageState
      indexed
      crawled
      indexable
      lastCrawlTime
      notIndexedReason
      statusColor
    }
  }
}
```

## データベーススキーマ

### google_index_statuses テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | bigint | 主キー |
| indexable_type | string | ポリモーフィック関連の種別 |
| indexable_id | bigint | ポリモーフィック関連のID |
| inspection_result_link | string | 検証結果のURL |
| coverage_state | string | カバレッジ状態 |
| crawled_as | string | クロール方法（MOBILE, DESKTOP） |
| indexing_allowed | boolean | インデックス許可されているか |
| last_crawl_time | datetime | 最終クロール日時 |
| page_fetch_state | string | ページ取得状態 |
| verdict | string | 総合判定（PASS, FAIL, PARTIAL, NEUTRAL） |
| google_canonical | string | Googleが認識しているカノニカルURL |
| user_canonical | string | ユーザーが指定したカノニカルURL |
| rich_results_items | json | リッチリザルト情報 |
| mobile_friendly_verdict | string | モバイルフレンドリー判定 |
| mobile_friendly_issues | json | モバイルユーザビリティの問題 |
| inspected_url | string | 検査対象URL（必須） |
| raw_response | json | API生レスポンス（デバッグ用） |
| created_at | datetime | 作成日時 |
| updated_at | datetime | 更新日時 |

**インデックス:**
- `index_google_statuses_on_indexable` (indexable_type, indexable_id)
- `inspected_url`
- `coverage_state`
- `last_crawl_time`

## ファイル構成

### Backend

- `backend/Gemfile` - google-apis-searchconsole_v1 gem 追加
- `backend/db/migrate/20260214102900_create_google_index_statuses.rb` - マイグレーション
- `backend/app/models/google_index_status.rb` - モデル
- `backend/app/models/seo_index_row.rb` - ラッパークラス
- `backend/app/services/google_search_console_service.rb` - Google API サービス
- `backend/app/graphql/types/google_index_status_type.rb` - GraphQL 型
- `backend/app/graphql/mutations/update_google_index_status.rb` - Mutation
- `backend/app/graphql/resolvers/seo_index_list_resolver.rb` - リゾルバー更新
- `backend/app/models/spot.rb` - has_one :google_index_status 追加
- `backend/app/models/play_plan.rb` - has_one :google_index_status 追加
- `backend/app/models/event.rb` - has_one :google_index_status 追加
- `backend/app/models/news.rb` - has_one :google_index_status 追加

### Admin

- `admin/src/app/seo/page.tsx` - UI更新（Google状態表示、更新ボタン）
- `admin/src/graphql/queries/getSeoIndexList.ts` - クエリ更新
- `admin/src/graphql/mutations/updateGoogleIndexStatus.ts` - Mutation追加

## API レート制限

Google Search Console API には以下のレート制限があります：

- **600 requests per minute per project**
- **2,000 requests per day per user per project**

大量のコンテンツを一括更新する場合は、バッチ処理を実装してレート制限に注意してください。

## トラブルシューティング

### 認証エラーが発生する

**エラー例:**
```
Google Search Console Service Account credentials not found.
```

**対処法:**
1. `bin/rails credentials:edit` で Service Account 情報が正しく設定されているか確認
2. JSON 形式が正しいか確認（特に private_key のインデント）

### API呼び出しエラー

**エラー例:**
```
Google::Apis::Error: Forbidden
```

**対処法:**
1. Service Account が Search Console のプロパティに追加されているか確認
2. 権限が「オーナー」または「フル」になっているか確認
3. Search Console API が有効になっているか確認

### URL が見つからない

**エラー例:**
```
Spot ID=123 が見つかりません
```

**対処法:**
1. 対象のレコードが存在するか確認
2. `indexableType` が正しいか確認（`Spot`, `PlayPlan`, `Event`, `News`）

### レート制限エラー

**エラー例:**
```
Google::Apis::Error: Rate Limited
```

**対処法:**
1. しばらく待ってから再試行
2. 一括更新の場合は、リクエスト間隔を開ける（例: 1秒ごと）
3. バッチ処理の実装を検討

## 今後の拡張

### バッチ処理の実装

Sidekiq や ActiveJob を使用して、定期的に全コンテンツのインデックス状態を更新する機能を実装することができます。

```ruby
# app/jobs/update_google_index_statuses_job.rb
class UpdateGoogleIndexStatusesJob < ApplicationJob
  queue_as :default

  def perform
    site_url = ENV.fetch("GOOGLE_SEARCH_CONSOLE_SITE_URL", "https://fukuoka-asobi.com")
    base_url = ENV.fetch("FRONTEND_URL", "http://localhost:8200")

    # スポットを更新
    Spot.where(is_indexable: true, is_public: true).find_each do |spot|
      url = "#{base_url}/spots/#{spot.id}"
      GoogleSearchConsoleService.update_index_status(spot, url, site_url)
      sleep 1 # レート制限対策
    end

    # 他のコンテンツタイプも同様に更新
    # ...
  end
end
```

### Cron での定期実行

```ruby
# config/schedule.rb (whenever gem使用時)
every 1.day, at: '3:00 am' do
  runner "UpdateGoogleIndexStatusesJob.perform_later"
end
```

## 参考資料

- [Google Search Console API - URL Inspection](https://developers.google.com/webmaster-tools/v1/api_reference_index)
- [Google Cloud - Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Rails Credentials](https://guides.rubyonrails.org/security.html#custom-credentials)
