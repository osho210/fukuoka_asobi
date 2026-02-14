# 画像利用承諾管理機能（Image Consent Management）

## 概要

店舗またはInstagram利用者から画像の利用承諾を取得し、承諾済み画像を管理画面で管理するMVP機能です。

## 機能一覧

### 1. 承諾依頼の作成（管理画面）

**パス**: `/admin/consent_requests/new`

- 対象店舗を選択
- 承諾者タイプ（店舗 / Instagram利用者）を選択
- 承諾者表示名と連絡手段を入力
- 承諾フォームURLを自動発行
- DM送信用テンプレート文を生成（コピペ運用）

**利用条件（MVP固定）**:
- 利用媒体: Webメディア / Instagram（公式アカウント）
- 利用範囲: 投稿 / ストーリーズ
- クレジット表記: 店舗名 / 撮影者名 / タグ付け希望
- 改変: トリミング・文字入れ等を許容

### 2. 承諾依頼一覧（管理画面）

**パス**: `/admin/consent_requests`

- ステータス別フィルタ（下書き / 送信済み / 承諾済み / 否認 / 撤回 / 期限切れ）
- 承諾フォームURLのコピー
- DM送信用テンプレート文のコピー
- 承諾日時の表示

### 3. 承諾フォーム（公開ページ）

**パス**: `/consent/[token]`

- トークンによる依頼の検証
- 承諾内容の表示（対象店舗・利用条件）
- 承諾者情報の入力
  - お名前（必須）
  - Instagramアカウント名（任意）
  - 撮影者名（任意）
  - タグ付け希望（店舗 / 撮影者）
- 権利確認チェック（必須）
- 同意送信
- 完了画面の表示

### 4. 承諾済み画像の登録（管理画面）

**パス**: `/admin/licensed_assets/new`

- 承諾情報（承諾済みのみ）を選択
- 登録方法の選択
  - 画像URL入力
  - ファイルアップロード（ActiveStorage）
- 元投稿URLの入力（任意）
- 説明・メモの入力（任意）

### 5. 承諾済み画像一覧（管理画面）

**パス**: `/admin/licensed_assets`

- カード型一覧表示
- 使用可否ステータスの表示
- 承諾者・撮影者情報の表示
- タグ付け希望の表示
- 元投稿へのリンク

## データモデル

### ConsentRequest（承諾依頼）

```ruby
- spot_id: 対象店舗ID
- consenter_type: 承諾者タイプ（STORE / INSTAGRAM_USER）
- consenter_display_name: 承諾者表示名
- contact_hint: 連絡手段（任意）
- status: ステータス（DRAFT / SENT / APPROVED / REJECTED / REVOKED / EXPIRED）
- token: 承諾フォームのトークン（ユニーク）
- expires_at: 有効期限
- created_by: 作成者ID
```

### ConsentAgreement（承諾結果/証跡）

```ruby
- consent_request_id: 承諾依頼ID
- agreed_at: 承諾日時
- agreement_version: 同意文バージョン
- agreement_snapshot_json: 承諾内容のスナップショット（JSON）
- signer_name: 承諾者名
- signer_instagram: Instagramアカウント名
- photographer_name: 撮影者名
- tag_store_requested: 店舗タグ付け希望
- tag_photographer_requested: 撮影者タグ付け希望
- tag_accounts_text: タグ付けアカウント名
- rights_confirmed: 権利確認（必須 true）
- ip_address: IPアドレス（監査用）
- user_agent: ユーザーエージェント（監査用）
```

### LicensedAsset（承諾済み画像）

```ruby
- spot_id: 対象店舗ID
- consent_agreement_id: 承諾ID
- asset_type: 登録方法（UPLOAD / URL）
- asset_url: 画像URL（URLの場合）
- asset_file: 画像ファイル（ActiveStorage、UPLOADの場合）
- source_url: 元投稿URL
- caption_note: 説明・メモ
- usable: 使用可否（デフォルト true）
```

## GraphQL API

### Mutations

```graphql
# 承諾依頼作成
createConsentRequest(input: ConsentRequestInput!): CreateConsentRequestPayload

# 承諾依頼ステータス更新
updateConsentRequestStatus(id: ID!, status: ConsentRequestStatusEnum!): UpdateConsentRequestStatusPayload

# 承諾記録作成（外部フォーム用）
createConsentAgreement(input: ConsentAgreementInput!): CreateConsentAgreementPayload

# 承諾済み画像登録
createLicensedAsset(input: LicensedAssetInput!): CreateLicensedAssetPayload

# 承諾済み画像更新
updateLicensedAsset(id: ID!, usable: Boolean, captionNote: String): UpdateLicensedAssetPayload
```

### Queries

```graphql
# 承諾依頼一覧
consentRequests(spotId: ID, status: ConsentRequestStatusEnum): [ConsentRequest!]!

# 承諾依頼詳細
consentRequest(id: ID, token: String): ConsentRequest

# 承諾済み画像一覧
licensedAssets(spotId: ID, usable: Boolean): [LicensedAsset!]!
```

## ユースケース

### 1. 店舗画像の承諾依頼

1. 管理画面で対象店舗を選択して承諾依頼を作成
2. 承諾フォームURLをコピー
3. DM送信用テンプレート文をコピー
4. InstagramのDMで手動送信
5. 店舗側が承諾フォームからアクセスして承諾
6. 管理画面で承諾済みステータスを確認
7. 承諾済み画像を登録（アップロードまたはURL）

### 2. Instagram投稿者への承諾依頼

1. 管理画面で承諾者タイプ「Instagram利用者」で依頼作成
2. 承諾者表示名に「@username」を入力
3. 承諾フォームURLとDM文をコピー
4. Instagram DMで送信
5. 投稿者が承諾フォームから承諾
6. 承諾済み画像を登録

### 3. 承諾の撤回

1. 管理画面で承諾依頼のステータスを「撤回」に更新
2. 紐づく画像の `usable` を false に更新
3. 既出の投稿削除は運用で対応（メモ機能を使用）

## セキュリティ

- 承諾フォームURLは推測困難なトークン（SecureRandom.urlsafe_base64(32)）
- トークンには有効期限（デフォルト30日）
- 同意完了後の再同意は不可（再依頼を発行）
- 権利確認チェック必須

## 監査性

- 同意文バージョン + タイムスタンプで履歴管理
- 同意内容のスナップショット（JSON）を保存
- IPアドレス・ユーザーエージェントを記録（任意）
- 管理者操作ログ（created_by）

## 将来拡張（v1.1+）

- 改変可否（トリミング/文字入れ）のチェックボックス化
- 使用期間（期限付き許諾）
- 承諾者の本人性担保（メール確認コード）
- Instagram API連携（審査・権限の範囲内で）
- 画像の利用先（投稿URL）の紐づけ・履歴管理

## 運用フロー

```
管理者側:
  承諾依頼作成 → URL発行 → DM送信（手動）→ 承諾確認 → 画像登録

承諾者側:
  URL受信 → フォームアクセス → 承諾内容確認 → 同意送信 → 完了
```

## 注意事項

- MVPでは Instagram API は使用しない（手動DM運用）
- 広告利用（ブースト投稿等）は含まない
- 正式な契約書生成機能はなし（同意文面＋証跡で代替）
- 高度な本人確認（eKYC、SNS認証）は含まない
