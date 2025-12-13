# 本番環境デプロイメント設定ガイド

## 📋 概要

このドキュメントは、福岡あそびアプリケーションを本番環境にデプロイする際に必要な設定項目をまとめたものです。

**最終更新**: 2025年12月13日
**デプロイ方式**: Kamal (ConoHa VPS) + Vercel
**ストレージ**: MinIO (コンテナ内)
**データベース**: MySQL (コンテナ内)

---

## 🔧 設定済みの項目（チェック済み）

### ✅ バックエンド（Rails）設定

#### 1. Production環境設定 (`backend/config/environments/production.rb`)
- SSL強制有効化
- ホスト認証設定（`api.fukuoka-asobi.com`, `www.fukuoka-asobi.com`, `fukuoka-asobi.com`）
- アセットホストの設定
- ログレベル設定

#### 2. CORS設定 (`backend/config/initializers/cors.rb`)
- ✅ **既に本番用に設定済み**
- 許可されたオリジン:
  - `https://fukuoka-asobi.com`
  - `https://www.fukuoka-asobi.com`
  - `http://localhost:8200` (開発環境)
  - `http://localhost:9200` (開発環境)
  - `https://fukuoka-asobi.vercel.app` (Vercel)

#### 3. データベース設定 (`backend/config/database.yml`)
- MySQL Adapter設定
- 本番用の接続プール設定（10スレッド）

#### 4. ストレージ設定 (`backend/config/storage.yml`)
- ✅ **修正完了**: 本番用MinIO設定（`minio_production`）を追加
- 環境変数を使用して動的に接続情報を設定

#### 5. Kamalデプロイ設定 (`backend/config/deploy.yml`)
- ✅ **修正完了**: `ACTIVE_STORAGE_SERVICE: minio_production` に更新
- MinIOコンテナ設定
- MySQLコンテナ設定
- 環境変数の自動注入設定

---

### ✅ フロントエンド（Next.js）設定

#### 1. Frontend設定 (`frontend/next.config.ts`)
- ✅ 画像ホスト設定済み
  - Cloudflare R2対応（`**.r2.cloudflarestorage.com`）
  - Fly.dev対応（`**.fly.dev`）
  - MinIO対応（ホスト設定で対応）

#### 2. Admin設定 (`admin/next.config.ts`)
- ✅ 画像ホスト設定済み
  - Cloudflare R2対応
  - Fly.dev対応
  - MinIO対応

---

## 🚀 本番環境デプロイ前のチェックリスト

### ステップ1: 事前準備

- [ ] GitHubリポジトリが最新状態に更新されている
- [ ] すべての変更がコミット・プッシュされている
- [ ] GitHub Actions CDパイプラインが動作している

### ステップ2: 環境変数設定

#### バックエンド（Kamal/ConoHa VPS）

**Secret環境変数**（安全に管理する）
```bash
flyctl/kamal secrets を設定または .env.secret で管理:

# Rails設定
RAILS_MASTER_KEY=<config/master.keyから取得>
SECRET_KEY_BASE=<`cd backend && bundle exec rails secret`で生成>

# データベース
DB_PASSWORD=<MySQL のパスワード>

# MinIO
MINIO_ROOT_PASSWORD=<MinIOのルートパスワード>

# MySQL
MYSQL_ROOT_PASSWORD=<MySQLのルートパスワード>
```

**Clear環境変数**（`deploy.yml`に記載済み）
```yaml
RAILS_ENV: production
DB_HOST: fukuoka-asobi-backend-db
DB_PORT: 3306
DB_USERNAME: fukuoka_asobi
DB_NAME: fukuoka_asobi_production
MINIO_ENDPOINT: http://fukuoka-asobi-backend-minio:9000
MINIO_ROOT_USER: fukuoka_asobi
ACTIVE_STORAGE_SERVICE: minio_production
```

**Kamal デプロイ環境変数**
```bash
# ConoHa VPS IP アドレス
export CONOHA_VPS_IP=xxx.xxx.xxx.xxx

# GitHub Container Registry 認証情報
export KAMAL_REGISTRY_USER=<GitHubユーザー名>
export KAMAL_REGISTRY_PASSWORD=<GitHubのPersonal Access Token>
```

#### フロントエンド（Vercel）

**Frontend プロジェクト**
```
NEXT_PUBLIC_BACKEND_URL=https://api.fukuoka-asobi.com
NODE_ENV=production
```

**Admin プロジェクト**
```
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.fukuoka-asobi.com/graphql
NEXT_PUBLIC_BACKEND_URL=https://api.fukuoka-asobi.com
NODE_ENV=production
```

### ステップ3: データベース初期化

```bash
# デプロイ後、Kamalコンソール経由でマイグレーション実行
kamal app exec -i "bin/rails db:migrate"

# シードデータ投入（必要な場合）
kamal app exec -i "bin/rails db:seed"
```

### ステップ4: MinIOバケット作成

```bash
# MinIOコンソール（ポート9001）にアクセス:
# http://<CONOHA_VPS_IP>:9001

# ログイン情報:
# ユーザー名: fukuoka_asobi
# パスワード: <MINIO_ROOT_PASSWORD>

# または、Kamalコマンドで作成:
kamal app exec -i "bin/rails runner 'require \"aws-sdk-s3\"; client = ActiveStorage::Blob.service.client; client.create_bucket(bucket: \"fukuoka-asobi-production\") rescue nil'"
```

### ステップ5: 動作確認

#### バックエンド確認
```bash
# ヘルスチェック
curl https://api.fukuoka-asobi.com/up

# GraphQL疎通確認
curl -X POST https://api.fukuoka-asobi.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'

# ストレージサービス確認
kamal app exec -i "bin/rails runner 'puts ActiveStorage::Blob.service.class'"
```

#### フロントエンド確認
- [ ] https://fukuoka-asobi.vercel.app にアクセス可能
- [ ] ページが正常に読み込まれている
- [ ] GraphQL クエリが実行できている
- [ ] 画像が表示されている

#### 管理画面確認
- [ ] https://admin-fukuoka-asobi.vercel.app にアクセス可能
- [ ] ログインできている
- [ ] 画像アップロードができている
- [ ] アップロード画像が表示されている

---

## ⚠️ 重要な注意点

### 1. ホスト設定
`backend/config/environments/production.rb` の `config.hosts` は現在ハードコード済みです：
```ruby
config.hosts << "api.fukuoka-asobi.com"
config.hosts << "www.fukuoka-asobi.com"
config.hosts << "fukuoka-asobi.com"
```

異なるドメインを使用する場合は、このファイルを更新してください。

### 2. CORS設定
`backend/config/initializers/cors.rb` は現在ハードコード済みです。

Vercel のURLが確定したら、以下を確認・更新してください：
```ruby
origins "https://fukuoka-asobi.vercel.app"  # Vercelの実際のURL
```

### 3. MinIOの公開設定
MinIOから直接画像を配信する場合、バケットを公開設定にする必要があります。

MinIOコンソール（ポート9001）で：
1. バケット選択
2. 「Administration > Bucket Policies」
3. 公開ポリシーを適用

または、コマンドで：
```bash
kamal app exec -i "bin/rails runner 'ActiveStorage::Blob.service.client.put_bucket_policy(bucket: \"fukuoka-asobi-production\", policy: \"{\\\"Version\\\": \\\"2012-10-17\\\", \\\"Statement\\\": [{\\\"Effect\\\": \\\"Allow\\\", \\\"Principal\\\": \\\"*\\\", \\\"Action\\\": \\\"s3:GetObject\\\", \\\"Resource\\\": \\\"arn:aws:s3:::fukuoka-asobi-production/*\\\"}]}\")'"
```

### 4. SSL/TLS証明書
Kamal は Let's Encrypt を使用して自動的にSSL証明書を発行・更新します。

証明書の確認：
```bash
kamal proxy details
```

---

## 🔐 セキュリティに関する確認事項

### 必須確認事項

- [ ] RAILS_MASTER_KEY が安全に保管されている
- [ ] SECRET_KEY_BASE が十分にランダムである
- [ ] データベースパスワードが十分に強固である
- [ ] MinIOのルートパスワードが十分に強固である
- [ ] SSH接続が鍵ベース認証になっている（パスワード認証は無効）
- [ ] ファイアウォール設定が適切である
  - SSH: ポート10022（Kamal用）
  - HTTP: ポート80（リダイレクト用）
  - HTTPS: ポート443（本番トラフィック）
  - MinIO Console: ポート9001（ローカルネットワークのみ）

### ログ確認

```bash
# 本番環境ログの確認
kamal app logs

# 特定のエラーを検索
kamal app logs | grep ERROR
```

---

## 📊 トラブルシューティング

### GraphQL が応答しない

```bash
# 1. ログを確認
kamal app logs | grep graphql

# 2. エンドポイント確認
curl -v https://api.fukuoka-asobi.com/graphql

# 3. コンテナ状態確認
kamal app details
```

### 画像が表示されない

```bash
# 1. MinIO接続確認
kamal app exec -i "bin/rails runner 'puts ActiveStorage::Blob.service.client.list_buckets'"

# 2. バケット確認
kamal app exec -i "bin/rails runner 'puts ActiveStorage::Blob.service.client.list_objects_v2(bucket: \"fukuoka-asobi-production\").contents.map(&:key)'"

# 3. 画像URL確認（コンソールで）
kamal app exec -i "bin/rails console"
# > Blob.last.url を実行
```

### CORS エラーが発生

```bash
# ブラウザコンソールで確認:
# Access to XMLHttpRequest at 'https://api.fukuoka-asobi.com/graphql' from origin 'https://fukuoka-asobi.vercel.app'
# has been blocked by CORS policy

# 対応:
# 1. cors.rb の origins に正しいURLが含まれているか確認
# 2. 変更後、デプロイ: kamal deploy
```

### データベース接続エラー

```bash
# 1. MySQL接続確認
kamal app exec -i "bin/rails dbconsole"

# 2. 環境変数確認
kamal app exec -i "env | grep DB_"

# 3. ログ確認
kamal app logs | grep database
```

---

## 📝 本番環境構成図

```
┌─────────────────────────────────────────────────────────────┐
│                    ユーザーのブラウザ                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   [Frontend]      [Admin]      [API]
   Vercel          Vercel        Vercel
                                 (実際の運用では
                                  ConoHa VPS)

                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   Let's Encrypt SSL/TLS    │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │    Nginx リバースプロキシ    │
                    │   (Kamal Proxy)           │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  Rails アプリケーション     │
                    │  (コンテナ)                │
                    └──────────────┬──────────────┘
                                   │
        ┌──────────────┬───────────┴───────────┬──────────────┐
        │              │                       │              │
        ▼              ▼                       ▼              ▼
     MySQL          MinIO                 Redis        (その他)
  コンテナ          コンテナ              コンテナ
  (リモート或は      (ローカル)
   ローカル)
```

---

## 🔄 デプロイフロー

### 1. ローカルで変更をコミット・プッシュ
```bash
git add .
git commit -m "本番環境用設定の更新"
git push origin main
```

### 2. GitHub Actions CI/CD が自動実行
- DockerイメージがビルドされてGHCRにプッシュ

### 3. Kamalでデプロイ実行
```bash
cd backend
kamal deploy
```

### 4. マイグレーション実行
```bash
kamal app exec -i "bin/rails db:migrate"
```

### 5. 動作確認

---

## 📚 関連ドキュメント

- `DEPLOYMENT_CHECKLIST.md` - デプロイメント完全チェックリスト
- `DEPLOYMENT_GUIDE_VPS.md` - VPS環境デプロイガイド
- `KAMAL_DEPLOYMENT_GUIDE.md` - Kamal詳細ガイド
- `KAMAL_QUICKSTART.md` - Kamalクイックスタート

---

## ✅ チェックリスト（最終確認）

本番環境デプロイ前の最終確認：

- [ ] すべてのシークレット環境変数が設定済み
- [ ] バックエンドのCORS設定が正しい
- [ ] ホスト設定が実際のドメインに合致
- [ ] ストレージ設定が minio_production を使用
- [ ] フロントエンド・管理画面の環境変数が設定済み
- [ ] Vercel プロジェクトの環境変数が設定済み
- [ ] GitHub Container Registry 認証情報が設定済み
- [ ] SSH鍵ベース認証が設定済み
- [ ] ファイアウォール設定が完了
- [ ] データベースとMinIOのパスワードが強固
- [ ] バックアップ計画が立案済み
- [ ] モニタリング・ログ管理の準備完了

すべての項目にチェックが入ったら、デプロイを実行できます。

---

**最終更新**: 2025年12月13日
**作成者**: Cline
**ステータス**: 本番環境デプロイ準備完了
