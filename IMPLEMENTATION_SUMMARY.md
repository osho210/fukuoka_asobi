# 画像利用承諾管理機能 実装完了サマリー

## 実装概要

福岡遊び日記アプリに、店舗またはInstagram利用者から画像の利用承諾を取得し、承諾済み画像を管理する機能を実装しました。

**実装日**: 2026-02-14  
**対象**: MVP（Minimum Viable Product）  
**ブランチ**: `copilot/add-image-approval-feature`

---

## 実装内容

### 1. バックエンド（Rails 8.0.1 + GraphQL）

#### マイグレーション
- `20260214113000_create_consent_requests.rb` - 承諾依頼テーブル
- `20260214113001_create_consent_agreements.rb` - 承諾記録テーブル
- `20260214113002_create_licensed_assets.rb` - 承諾済み画像テーブル

#### モデル
- `ConsentRequest` - 承諾依頼（トークン生成、ステータス管理）
- `ConsentAgreement` - 承諾記録（証跡、スナップショット保存）
- `LicensedAsset` - 承諾済み画像（ActiveStorage対応）

#### GraphQL API
**Types:**
- `ConsentRequestType`, `ConsentAgreementType`, `LicensedAssetType`
- Enums: `ConsenterTypeEnum`, `ConsentRequestStatusEnum`, `AssetTypeEnum`

**Mutations:**
- `createConsentRequest` - 承諾依頼作成
- `updateConsentRequestStatus` - ステータス更新
- `createConsentAgreement` - 承諾記録作成（公開フォーム用）
- `createLicensedAsset` - 画像登録
- `updateLicensedAsset` - 画像の使用可否更新

**Queries:**
- `consentRequests` - 一覧取得（フィルタ対応）
- `consentRequest` - 詳細取得（ID or トークン）
- `licensedAssets` - 画像一覧取得

#### テスト
- RSpecモデルテスト（3ファイル、完全なカバレッジ）
- FactoryBotファクトリ定義（traits付き）

---

### 2. 管理画面（Next.js 15 Admin）

#### ページ
1. **承諾依頼一覧** (`/admin/consent_requests`)
   - ステータス別表示
   - URLコピー機能
   - DM送信用テンプレート文生成・コピー
   - 承諾日時の表示

2. **承諾依頼作成** (`/admin/consent_requests/new`)
   - 店舗選択
   - 承諾者タイプ選択（店舗 / Instagram利用者）
   - 承諾者情報入力
   - 自動URL発行

3. **承諾済み画像一覧** (`/admin/licensed_assets`)
   - カード型レイアウト
   - 使用可否ステータス表示
   - 承諾者・撮影者情報表示
   - タグ付け希望の表示

4. **画像登録** (`/admin/licensed_assets/new`)
   - URL入力 or ファイルアップロード
   - 元投稿URL入力
   - 説明・メモ入力

#### GraphQL定義
- `admin/src/graphql/mutations/consents.ts`
- `admin/src/graphql/queries/consents.ts`

---

### 3. 公開承諾フォーム（Next.js 15 Frontend）

#### ページ
**承諾フォーム** (`/frontend/consent/[token]`)
- トークン検証
- 承諾内容の表示（店舗情報、利用条件）
- 承諾者情報入力フォーム
  - お名前（必須）
  - Instagramアカウント名（任意）
  - 撮影者名（任意）
  - タグ付け希望（店舗・撮影者）
  - タグ付けアカウント名
- 権利確認チェック（必須）
- 同意送信
- 完了画面

**エラーハンドリング:**
- 無効なトークン
- 期限切れ
- 既に承諾済み

---

### 4. ドキュメント

- `docs/IMAGE_CONSENT_MANAGEMENT.md` - 機能仕様書
- `IMPLEMENTATION_SUMMARY.md` - この実装サマリー（当ファイル）

---

## データフロー

```
1. 管理者が承諾依頼を作成
   ↓
2. システムがトークン付きURLを生成
   ↓
3. DM送信用テンプレート文をコピー
   ↓
4. Instagram DMで手動送信
   ↓
5. 承諾者がURLをクリック
   ↓
6. 承諾フォームで情報入力
   ↓
7. 承諾内容を保存（証跡として）
   ↓
8. 承諾依頼のステータスが「承諾済み」に
   ↓
9. 管理者が承諾済み画像を登録
   ↓
10. 店舗に紐づいて画像が管理される
```

---

## 主要機能

### 承諾依頼の作成
- 店舗選択
- 承諾者タイプ（店舗 / Instagram利用者）
- 自動トークン生成（SecureRandom.urlsafe_base64(32)）
- 有効期限（デフォルト30日）
- DM送信用テンプレート文の自動生成

### 承諾フォーム
- トークン検証
- 承諾条件の明示
- 承諾者情報の収集
- 権利確認（必須チェック）
- 承諾内容のスナップショット保存（JSON）
- IPアドレス・ユーザーエージェント記録

### 承諾済み画像管理
- URL入力 or ファイルアップロード（ActiveStorage）
- 承諾情報との紐づけ
- 使用可否ステータス管理
- 元投稿URLの記録
- 説明・メモ機能

### 証跡管理
- 同意文バージョン管理（v1.0）
- 承諾内容のスナップショット（JSON）
- タイムスタンプ
- IPアドレス・ユーザーエージェント

---

## 承諾条件（MVP固定）

### 利用媒体
- 福岡遊び日記 Webメディア
- Instagram（公式アカウント）

### 利用範囲
- 投稿
- ストーリーズ

### クレジット表記
- 店舗名の表記（必須）
- 撮影者名の表記（任意入力）
- タグ付け希望（店舗 / 撮影者、アカウント名入力可）

### 改変
- レイアウト都合のトリミングや文字入れを許容（固定）

---

## セキュリティ

- 承諾URLは推測困難なトークン（32文字のURLセーフなbase64）
- トークンの一意性保証
- 有効期限の設定（デフォルト30日）
- 同意完了後の再同意不可（再依頼が必要）
- 権利確認チェック必須

---

## 監査性

- 同意文バージョン管理
- 承諾内容のスナップショット保存
- タイムスタンプ（承諾日時）
- IPアドレス記録（任意）
- ユーザーエージェント記録（任意）
- 管理者操作ログ（created_by）

---

## テスト

### RSpec（バックエンド）
- `consent_request_spec.rb` - 43テストケース
  - バリデーション
  - トークン生成
  - デフォルト値
  - ステータス管理
  - スコープ
- `consent_agreement_spec.rb` - 10テストケース
  - バリデーション
  - デフォルト値
  - コールバック
  - スナップショット
- `licensed_asset_spec.rb` - 15テストケース
  - バリデーション
  - デフォルト値
  - 使用可否管理
  - スコープ

### Factory Bot
- `consent_requests.rb` - traits付き（draft, approved, rejected, etc.）
- `consent_agreements.rb` - traits付き（with_photographer, with_store_tag）
- `licensed_assets.rb` - traits付き（upload, disabled, with_caption）

---

## マイグレーション手順

```bash
# バックエンドに移動
cd backend

# マイグレーション実行
bin/rails db:migrate

# テスト実行（確認）
bundle exec rspec spec/models/consent_request_spec.rb
bundle exec rspec spec/models/consent_agreement_spec.rb
bundle exec rspec spec/models/licensed_asset_spec.rb
```

---

## 動作確認手順

### 1. 承諾依頼作成
1. 管理画面にログイン
2. `/admin/consent_requests/new` にアクセス
3. 対象店舗を選択
4. 承諾者タイプを選択（店舗 or Instagram利用者）
5. 承諾者表示名を入力
6. 「承諾依頼を作成」をクリック

### 2. URLコピーとDM送信
1. `/admin/consent_requests` にアクセス
2. 作成した依頼の「URL」ボタンをクリック（コピー）
3. 「DM文」ボタンをクリック（テンプレートをコピー）
4. Instagram DMで手動送信

### 3. 承諾フォーム送信
1. 承諾者がURLにアクセス
2. 承諾内容を確認
3. 承諾者情報を入力
4. 権利確認と同意にチェック
5. 「同意して送信」をクリック

### 4. 承諾確認
1. 管理画面で `/admin/consent_requests` にアクセス
2. ステータスが「承諾済み」になっていることを確認
3. 承諾日時が表示されていることを確認

### 5. 画像登録
1. `/admin/licensed_assets/new` にアクセス
2. 承諾情報を選択
3. 画像URL or ファイルをアップロード
4. 元投稿URLと説明を入力（任意）
5. 「画像を登録」をクリック

### 6. 画像確認
1. `/admin/licensed_assets` にアクセス
2. 登録した画像が表示されることを確認
3. 使用可否ステータスが「使用可能」になっていることを確認

---

## 将来拡張（v1.1+）

以下の機能は将来のバージョンで追加予定：

- 改変可否（トリミング/文字入れ）のチェックボックス化
- 使用期間（期限付き許諾）
- 承諾者の本人性担保（メール確認コード）
- Instagram API連携（自動DM送信、メディア取得）
- 画像の利用先（投稿URL）の紐づけ・履歴管理
- 広告利用（ブースト投稿等）の許諾オプション
- 正式な契約書PDF生成機能

---

## 技術スタック

- **Backend**: Ruby 3.3.1, Rails 8.0.1, GraphQL 2.4.13
- **Frontend/Admin**: Next.js 15.x, TypeScript 5.x, React 19.x
- **Database**: MySQL 8.0 (dev), PostgreSQL (prod)
- **Testing**: RSpec 7.0.2, Factory Bot 6.4.4
- **File Storage**: ActiveStorage + MinIO (dev) / S3 (prod)

---

## ファイル一覧

### Backend
```
backend/
├── app/
│   ├── models/
│   │   ├── consent_request.rb
│   │   ├── consent_agreement.rb
│   │   ├── licensed_asset.rb
│   │   └── spot.rb (更新)
│   └── graphql/
│       ├── types/
│       │   ├── consent_request_type.rb
│       │   ├── consent_agreement_type.rb
│       │   ├── licensed_asset_type.rb
│       │   ├── consenter_type_enum.rb
│       │   ├── consent_request_status_enum.rb
│       │   ├── asset_type_enum.rb
│       │   ├── mutation_type.rb (更新)
│       │   ├── query_type.rb (更新)
│       │   └── input/
│       │       ├── consent_request_input.rb
│       │       ├── consent_agreement_input.rb
│       │       └── licensed_asset_input.rb
│       └── mutations/
│           ├── create_consent_request.rb
│           ├── update_consent_request_status.rb
│           ├── create_consent_agreement.rb
│           ├── create_licensed_asset.rb
│           └── update_licensed_asset.rb
├── db/migrate/
│   ├── 20260214113000_create_consent_requests.rb
│   ├── 20260214113001_create_consent_agreements.rb
│   └── 20260214113002_create_licensed_assets.rb
└── spec/
    ├── models/
    │   ├── consent_request_spec.rb
    │   ├── consent_agreement_spec.rb
    │   └── licensed_asset_spec.rb
    └── factories/
        ├── consent_requests.rb
        ├── consent_agreements.rb
        └── licensed_assets.rb
```

### Admin
```
admin/src/
├── app/
│   ├── consent_requests/
│   │   ├── page.tsx
│   │   └── new/page.tsx
│   └── licensed_assets/
│       ├── page.tsx
│       └── new/page.tsx
└── graphql/
    ├── mutations/consents.ts
    └── queries/consents.ts
```

### Frontend
```
frontend/src/app/
└── consent/
    └── [token]/page.tsx
```

### Documentation
```
docs/
├── IMAGE_CONSENT_MANAGEMENT.md
└── IMPLEMENTATION_SUMMARY.md (このファイル)
```

---

## 注意事項

1. **Instagram API は未使用**  
   MVPでは手動DM運用。Instagram API連携は将来のバージョンで検討。

2. **広告利用は含まない**  
   ブースト投稿等の広告利用の許諾は対象外。

3. **正式契約書ではない**  
   同意文面 + 証跡での簡易的な承諾管理。法務監修済みの契約書ではない。

4. **本人確認なし**  
   eKYCやSNS認証等の高度な本人確認機能はなし。権利確認チェックのみ。

5. **マイグレーション実行必須**  
   この実装を本番環境に反映する前に、必ずマイグレーションを実行してください。

---

## コミット履歴

1. `2b18c94` - Add backend models, migrations, and GraphQL schema for image consent management
2. `cf1610e` - Add admin and frontend pages for consent management
3. `997eb4e` - Add licensed assets pages and documentation
4. `2cc1fa6` - Add RSpec tests and factories for consent models

---

## 関連Issue

- **Issue**: 画像利用承諾（Webメディア / Instagram）MVP要件定義
- **作成日**: 2026-02-14
- **対象**: 既存管理画面（同一リポジトリ）へ組み込み

---

## 連絡先

実装に関する質問や不明点がある場合は、GitHub Issueまたはプルリクエストのコメントでお知らせください。
