# Cloudflare R2 への移行ガイド

## 概要

本ドキュメントでは、ActiveStorage のストレージバックエンドを MinIO から Cloudflare R2 に移行する手順を説明します。

## 背景

### 移行前の課題

1. **本番環境でのバケットエラー**: `The specified bucket does not exist` エラーが発生
2. **VPS 上での MinIO 運用負荷**: バックアップ・監視・保守コストが高い
3. **インフラ構成の複雑化**: Cloudflare Pages/Workers を既に利用しているため、エコシステムの統一が望ましい

### 移行後のメリット

- Cloudflare のマネージドサービスによる安定性の向上
- バックアップ・監視の自動化
- スケーラビリティの向上
- 運用コストの削減
- Cloudflare エコシステムへの統一

## 技術仕様

### 対象モデル

以下の4つのモデルで ActiveStorage を使用しています：

| モデル | アタッチメント | 用途 |
|--------|---------------|------|
| User | `has_one_attached :avatar` | プロフィール画像 |
| PlayPlan | `has_many_attached :images` | プラン画像 |
| Spot | `has_many_attached :images` | スポット画像 |
| Menu | `has_one_attached :image` | メニュー画像 |

### ストレージ設定

- **開発環境**: 引き続き MinIO を使用（`docker-compose.yml`）
- **本番環境**: Cloudflare R2 を使用（Kamal デプロイ）
- **署名付きURL**: `public: false` で安全にアクセス制御

## Cloudflare R2 のセットアップ

### 1. R2 Bucket の作成

1. Cloudflare Dashboard にログイン
2. R2 → Create bucket をクリック
3. Bucket 名を `fukuoka-asobi-production` に設定
4. Location を Auto に設定
5. Create bucket をクリック

### 2. R2 API Token の作成

1. R2 → Manage R2 API Tokens をクリック
2. Create API Token をクリック
3. 以下の設定を行う：
   - **Token name**: `fukuoka-asobi-backend-production`
   - **Permissions**: Object Read & Write
   - **TTL**: Forever（または適切な期間）
   - **Bucket**: `fukuoka-asobi-production`（特定のバケットに限定）
4. Create API Token をクリック
5. 以下の情報を保存（**再表示できないため必ず保存すること**）：
   - Access Key ID
   - Secret Access Key
   - Account ID

### 3. エンドポイントの確認

R2 のエンドポイントは以下の形式です：

```
https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

`<ACCOUNT_ID>` は、上記で取得した Account ID に置き換えてください。

### 4. CORS 設定（オプション）

フロントエンドから直接画像をアップロードする場合は、CORS 設定が必要です。

1. R2 → Bucket → Settings → CORS Policy をクリック
2. 以下の JSON を追加：

```json
[
  {
    "AllowedOrigins": [
      "https://fukuoka-asobi.com",
      "https://www.fukuoka-asobi.com",
      "https://admin.fukuoka-asobi.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

## Rails 設定

### storage.yml

`backend/config/storage.yml` に R2 用の設定を追加しました：

```yaml
r2_production:
  service: S3
  access_key_id: <%= ENV.fetch("R2_ACCESS_KEY_ID", "") %>
  secret_access_key: <%= ENV.fetch("R2_SECRET_ACCESS_KEY", "") %>
  region: auto
  endpoint: <%= ENV.fetch("R2_ENDPOINT", "") %>
  force_path_style: true
  bucket: <%= ENV.fetch("R2_BUCKET", "fukuoka-asobi-production") %>
  public: false
```

### 重要なパラメータ

- **force_path_style: true**: R2 は path-style のみサポートするため必須
- **region: auto**: R2 では region は使用されないが、設定が必要
- **public: false**: 署名付き URL で安全にアクセス制御

### production.rb

`backend/config/environments/production.rb` では、環境変数から ActiveStorage サービスを指定：

```ruby
config.active_storage.service = ENV.fetch("ACTIVE_STORAGE_SERVICE", "local").to_sym
```

## 環境変数の設定

### Kamal デプロイ用（本番環境）

`backend/config/deploy.yml` で以下の環境変数を設定しています：

#### Secret（`.kamal/secrets` で管理）

```ruby
env:
  secret:
    - R2_ACCESS_KEY_ID
    - R2_SECRET_ACCESS_KEY
```

`.kamal/secrets` ファイルで実際の値を設定：

```ruby
# .kamal/secrets (example)
R2_ACCESS_KEY_ID=<your-access-key-id>
R2_SECRET_ACCESS_KEY=<your-secret-access-key>
```

#### Clear（平文で deploy.yml に記載）

```yaml
env:
  clear:
    R2_ENDPOINT: <%= ENV.fetch("R2_ENDPOINT", "") %>
    R2_BUCKET: fukuoka-asobi-production
    ACTIVE_STORAGE_SERVICE: r2_production
```

### ローカル環境変数の設定（Kamal デプロイ用）

デプロイを実行するマシンで、以下の環境変数を設定：

```bash
export R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

または、`.env` ファイルに記載して `source .env` で読み込みます。

### docker-compose.prod.yml 用

`docker-compose.prod.yml` でも同様の環境変数を設定：

```yaml
environment:
  R2_ACCESS_KEY_ID: ${R2_ACCESS_KEY_ID}
  R2_SECRET_ACCESS_KEY: ${R2_SECRET_ACCESS_KEY}
  R2_ENDPOINT: ${R2_ENDPOINT}
  R2_BUCKET: ${R2_BUCKET:-fukuoka-asobi-production}
  ACTIVE_STORAGE_SERVICE: r2_production
```

`.env` ファイルで実際の値を設定してください。

## デプロイ手順

### 1. 事前準備

- [ ] Cloudflare R2 の bucket と API Token を作成済み
- [ ] Account ID, Access Key, Secret Key を取得済み
- [ ] ローカルマシンに環境変数を設定済み（`R2_ENDPOINT`）
- [ ] `.kamal/secrets` に R2 の認証情報を設定済み

### 2. デプロイの実行

```bash
# リポジトリのルートディレクトリで実行
cd /path/to/fukuoka_asobi/backend

# 設定ファイルの確認
kamal config

# デプロイの実行
kamal deploy
```

### 3. デプロイ後の確認

```bash
# アプリケーションログの確認
kamal app logs

# コンテナの状態確認
kamal app containers

# Rails コンソールに接続
kamal app exec --interactive "bin/rails console"
```

### 4. Rails コンソールでの確認

```ruby
# ActiveStorage サービスの確認
ActiveStorage::Blob.service.class
# => ActiveStorage::Service::S3Service

# 設定の確認
Rails.application.config.active_storage.service
# => :r2_production

# テストアップロード
blob = ActiveStorage::Blob.create_and_upload!(
  io: File.open(Rails.root.join('public', '422.html')),
  filename: 'test.html',
  content_type: 'text/html'
)

# URL の生成確認
blob.url
# => 署名付き URL が返される

# クリーンアップ
blob.purge
```

## 動作確認

### 管理画面でのテスト

1. 管理画面にログイン
2. 各モデルで画像アップロードをテスト：
   - User の avatar アップロード
   - PlayPlan の images アップロード
   - Spot の images アップロード
   - Menu の image アップロード
3. アップロード済み画像の表示確認
4. 画像の削除動作確認

### ログの確認

```bash
# アプリケーションログ
kamal app logs -f

# エラーがないことを確認
# ActiveStorage 関連のエラーが出ていないか確認
```

## トラブルシューティング

### エラー: "The specified bucket does not exist"

**原因**: Bucket 名が間違っているか、API Token に権限がない

**対策**:
- Bucket 名を確認（`fukuoka-asobi-production`）
- API Token の権限を確認（Object Read & Write）
- API Token が正しいバケットに紐付いているか確認

### エラー: "SignatureDoesNotMatch"

**原因**: Access Key または Secret Key が間違っている

**対策**:
- `.kamal/secrets` の認証情報を確認
- API Token を再生成して設定し直す

### エラー: "EndpointConnectionError"

**原因**: エンドポイント URL が間違っている

**対策**:
- `R2_ENDPOINT` の形式を確認: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
- Account ID が正しいか確認

### 画像が表示されない

**原因**: CORS 設定が不足している可能性

**対策**:
- R2 の CORS 設定を確認
- フロントエンドのドメインが許可されているか確認

### 署名付き URL の有効期限切れ

**原因**: ActiveStorage のデフォルト有効期限（5分）が短い

**対策**:
- `expires_in` オプションで有効期限を延長

```ruby
blob.url(expires_in: 1.hour)
```

## MinIO のクリーンアップ

### 注意事項

R2 への移行後、MinIO は不要になりますが、**既存データのバックアップを取ってから削除してください**。

### バックアップ手順

```bash
# MinIO コンテナ内のデータをローカルにバックアップ
docker cp fukuoka-asobi-backend-minio:/data /path/to/backup/minio-data
```

### クリーンアップ手順

```bash
# MinIO コンテナの停止（Kamal の場合）
kamal accessory stop minio

# MinIO コンテナの削除
kamal accessory remove minio

# ボリュームの確認
docker volume ls | grep minio

# ボリュームの削除
docker volume rm fukuoka-asobi-backend-minio-data
```

docker-compose.prod.yml を使用している場合：

```bash
# MinIO コンテナの停止
docker-compose -f docker-compose.prod.yml stop minio

# MinIO コンテナの削除
docker-compose -f docker-compose.prod.yml rm minio

# ボリュームの削除
docker volume rm fukuoka-asobi_minio_data_prod
```

## ロールバック手順

万が一問題が発生した場合のロールバック手順：

### 1. Git でコミットを戻す

```bash
git revert HEAD
git push
```

### 2. MinIO accessory を再起動

`backend/config/deploy.yml` で MinIO accessory のコメントを外して：

```bash
kamal accessory boot minio
kamal deploy
```

### 3. 環境変数を MinIO 用に戻す

`.kamal/secrets` と環境変数を MinIO 用に設定し直します。

## 将来の拡張

### Public Bucket + Custom Domain

画像配信を高速化するために、Public Bucket と Custom Domain を設定：

1. R2 Bucket を Public に変更
2. Custom Domain を設定（例: `assets.fukuoka-asobi.com`）
3. `storage.yml` で `public: true` に変更

### Cloudflare Workers による画像最適化

画像変換・最適化を Workers で実装：

- リサイズ・圧縮の自動化
- WebP 形式への変換
- レスポンシブ画像の生成

### image_processing gem の導入

バリアント最適化のために `image_processing` gem を導入：

```ruby
# Gemfile
gem 'image_processing', '~> 1.2'

# モデル
class Spot < ApplicationRecord
  has_many_attached :images do |attachable|
    attachable.variant :thumb, resize_to_limit: [300, 300]
    attachable.variant :medium, resize_to_limit: [800, 800]
  end
end
```

## 参考リンク

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Rails ActiveStorage Guide](https://guides.rubyonrails.org/active_storage_overview.html)
- [AWS SDK for Ruby - S3 Client](https://docs.aws.amazon.com/sdk-for-ruby/v3/api/Aws/S3/Client.html)
- [Kamal Documentation](https://kamal-deploy.org/)

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2024-12-21 | 1.0.0 | 初版作成 |
