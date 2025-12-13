# Kamal を使用した ConoHa VPS デプロイガイド

このガイドでは、Kamal を使用して ConoHa VPS 上に福岡あそびアプリケーションをデプロイする手順を説明します。

## 📋 前提条件

- ConoHa VPS サーバーが起動していること
- SSH 鍵認証が設定されていること
- ドメイン名が VPS の IP アドレスに紐付けられていること
- Docker がローカル環境にインストールされていること
- `config/master.key` ファイルを保持していること

## 🚀 Kamal とは

[Kamal](https://kamal-deploy.org/) は、37signals が開発した Docker ベースのデプロイツールです。

### 主な特徴

- ✅ **ゼロダウンタイムデプロイ**: Blue-Green デプロイメントを自動化
- ✅ **SSL 自動設定**: Let's Encrypt による SSL 証明書の自動取得・更新
- ✅ **シンプルな設定**: `config/deploy.yml` 1ファイルで完結
- ✅ **Accessories 管理**: MySQL、MinIO などの依存サービスを一元管理
- ✅ **ロールバック**: 簡単にデプロイを巻き戻し可能

## 🔧 初期セットアップ

### 1. Kamal のインストール

```bash
# Kamal は既に Gemfile に含まれています
cd backend
bundle install

# Kamal のバージョン確認
bin/kamal version
```

### 2. ConoHa VPS のセットアップ

#### SSH 接続の設定

```bash
# VPS に SSH 鍵でアクセスできることを確認
ssh root@YOUR_CONOHA_VPS_IP

# VPS 上で Docker をインストール
curl -fsSL https://get.docker.com | sh
systemctl start docker
systemctl enable docker

# Docker が正常に動作することを確認
docker --version
```

### 3. デプロイ設定ファイルの編集

#### `backend/config/deploy.yml` の編集

```yaml
# ConoHa VPS の IP アドレスを設定
servers:
  web:
    - YOUR_CONOHA_VPS_IP  # 例: 123.456.789.012

# ドメイン名を設定
proxy:
  ssl: true
  host: your-domain.com  # 例: fukuoka-asobi.com

# コンテナレジストリの設定
registry:
  # GitHub Container Registry を使用する場合
  server: ghcr.io
  username: your-github-username

  # または Docker Hub を使用する場合（server 行をコメントアウト）
  # username: your-dockerhub-username

image: ghcr.io/your-github-username/fukuoka-asobi-backend
# または Docker Hub の場合
# image: your-dockerhub-username/fukuoka-asobi-backend

# accessories の host も同じ IP に変更
accessories:
  db:
    host: YOUR_CONOHA_VPS_IP
  minio:
    host: YOUR_CONOHA_VPS_IP
```

### 4. 環境変数の設定

以下の環境変数をローカル環境に設定します：

```bash
# ~/.bashrc または ~/.zshrc に追加

# コンテナレジストリの認証情報
export KAMAL_REGISTRY_PASSWORD="your_github_token_or_dockerhub_token"

# MySQL パスワード
export MYSQL_ROOT_PASSWORD="your_secure_root_password"
export DB_PASSWORD="your_secure_db_password"

# MinIO 認証情報
export MINIO_ROOT_USER="fukuoka_asobi"
export MINIO_ROOT_PASSWORD="your_secure_minio_password"

# Rails シークレットキーベース（以下のコマンドで生成）
# cd backend && bundle exec rails secret
export SECRET_KEY_BASE="generated_secret_key_base"
```

設定を反映：

```bash
source ~/.bashrc  # または source ~/.zshrc
```

### 5. SSH 接続の確認

```bash
cd backend

# VPS への SSH 接続を確認
ssh -p 10022 deploy@YOUR_CONOHA_VPS_IP "echo 'Connection successful'"'"
```

## 📦 デプロイ手順

### 初回デプロイ

#### Step 1: セットアップ

```bash
cd backend

# Kamal の初期セットアップを実行
# - Docker ネットワークの作成
# - 必要なディレクトリの作成
bin/kamal setup
```

このコマンドで以下が実行されます：
- VPS 上に Docker ネットワークを作成
- MySQL と MinIO のコンテナを起動（accessories）
- ボリュームの作成

#### Step 2: データベースのマイグレーション

```bash
# データベースのセットアップ
bin/kamal app exec "bin/rails db:setup"

# または既存のデータベースがある場合
bin/kamal app exec "bin/rails db:migrate"
```

#### Step 3: デプロイの実行

```bash
# アプリケーションをデプロイ
bin/kamal deploy
```

デプロイが完了すると、以下が実行されます：
- Docker イメージのビルド
- イメージをレジストリにプッシュ
- VPS 上でコンテナを起動
- ヘルスチェック
- トラフィックの切り替え

#### Step 4: 動作確認

```bash
# アプリケーションのログを確認
bin/kamal app logs -f

# ヘルスチェック
curl https://your-domain.com/up
```

### 更新デプロイ

コードを更新した後、以下のコマンドでデプロイします：

```bash
cd backend

# 最新のコードを取得
git pull origin main

# デプロイ実行（ゼロダウンタイム）
bin/kamal deploy
```

Kamal が自動的に以下を実行します：
1. 新しい Docker イメージをビルド
2. 新しいコンテナを起動
3. ヘルスチェックが成功したらトラフィックを切り替え
4. 古いコンテナを停止

### ロールバック

問題が発生した場合、簡単にロールバックできます：

```bash
# 直前のバージョンにロールバック
bin/kamal rollback <version>

# バージョン履歴を確認
bin/kamal app containers
```

## 🛠️ よく使うコマンド

### アプリケーション管理

```bash
# ログを確認（リアルタイム）
bin/kamal app logs -f

# Rails コンソールを起動
bin/kamal console

# シェルに入る
bin/kamal shell

# データベースコンソールを起動
bin/kamal dbc

# 特定のコマンドを実行
bin/kamal app exec "bin/rails db:migrate"
```

### Accessories（MySQL/MinIO）管理

```bash
# Accessories の起動
bin/kamal accessory boot db
bin/kamal accessory boot minio

# Accessories の停止
bin/kamal accessory stop db
bin/kamal accessory stop minio

# Accessories の再起動
bin/kamal accessory reboot db
bin/kamal accessory reboot minio

# Accessories のログ確認
bin/kamal accessory logs db -f
bin/kamal accessory logs minio -f

# MySQL に接続
bin/kamal accessory exec db "mysql -u fukuoka_asobi -p fukuoka_asobi_production"
```

### デプロイ管理

```bash
# 現在のデプロイ状況を確認
bin/kamal details

# コンテナの状態を確認
bin/kamal app containers

# イメージをビルド（デプロイなし）
bin/kamal build

# 環境変数を確認
bin/kamal app exec "env | grep RAILS"
```

### トラブルシューティング

```bash
# Docker のログを確認
bin/kamal server exec "docker logs fukuoka-asobi-backend-web-<container_id>"

ssh deploy@YOUR_VPS_IP -p 10022 "docker ps -a"

# VPS のディスク使用状況を確認
ssh deploy@YOUR_VPS_IP -p 10022 "df -h"

# VPS のメモリ使用状況を確認
ssh deploy@YOUR_VPS_IP -p 10022 "free -h"

# Docker のログを確認
ssh deploy@YOUR_VPS_IP -p 10022 "docker logs fukuoka-asobi-backend-web-<container_id>"
```

## 🔒 セキュリティ設定

### 1. ファイアウォールの設定

ConoHa VPS のコントロールパネルまたは `ufw` でファイアウォールを設定：

```bash
# VPS 上で実行
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

### 2. SSL 証明書の自動更新

Kamal は Let's Encrypt を使用して SSL 証明書を自動的に取得・更新します。
`config/deploy.yml` の `proxy.ssl: true` 設定により、以下が自動化されます：

- SSL 証明書の取得
- 証明書の自動更新（90日ごと）
- HTTP から HTTPS へのリダイレクト

### 3. シークレットの管理

**重要**: 以下のファイルは絶対に Git にコミットしないでください：

- `config/master.key`
- 環境変数ファイル（`.env` など）

シークレットは環境変数または 1Password などのパスワードマネージャーで管理してください。

## 📊 モニタリング

### リソース監視

```bash
# CPU/メモリ使用状況をリアルタイム監視
bin/kamal server exec "docker stats"

# ディスク使用状況
bin/kamal server exec "df -h"

# Docker ボリュームの確認
bin/kamal server exec "docker volume ls"
```

### ログ管理

```bash
# アプリケーションログ（最新100行）
bin/kamal app logs --lines 100

# エラーログのみ抽出
bin/kamal app logs | grep ERROR

# 特定の時間帯のログ
bin/kamal app logs --since 2h  # 2時間前から
```

## 🔄 バックアップとリストア

### データベースのバックアップ

```bash
# MySQL のバックアップを取得（VPS 上で直接実行する方が確実）
ssh deploy@YOUR_CONOHA_VPS_IP -p 10022 \
  "docker exec fukuoka-asobi-backend-db mysqldump -u fukuoka_asobi -p fukuoka_asobi_production" \
  > backup_$(date +%Y%m%d).sql

# または VPS 上で直接実行
ssh root@YOUR_CONOHA_VPS_IP "docker exec fukuoka-asobi-backend-db mysqldump -u fukuoka_asobi -p'${DB_PASSWORD}' fukuoka_asobi_production" > backup_$(date +%Y%m%d).sql
```

### データベースのリストア

```bash
# バックアップをリストア
cat backup_20241206.sql | bin/kamal accessory exec -i db "mysql -u fukuoka_asobi -p fukuoka_asobi_production"
```

### MinIO データのバックアップ

```bash
# MinIO データをバックアップ（VPS 上で実行）
ssh root@YOUR_CONOHA_VPS_IP << 'EOF'
  docker run --rm \
    -v fukuoka-asobi-backend-minio-data:/data \
    -v $(pwd):/backup \
    alpine tar czf /backup/minio_backup_$(date +%Y%m%d).tar.gz -C /data .
EOF
```

## 🐛 トラブルシューティング

### デプロイが失敗する

```bash
# 詳細なログを確認
bin/kamal deploy --verbose

# Docker イメージのビルドログを確認
bin/kamal build --verbose

# VPS の状態を確認
bin/kamal details
```

### データベース接続エラー

```bash
# MySQL コンテナが起動しているか確認
bin/kamal accessory details db

# データベース接続設定を確認
bin/kamal app exec "bin/rails runner 'puts ActiveRecord::Base.connection.execute(\"SELECT 1\").to_a'"

# 環境変数を確認
bin/kamal app exec "env | grep DB_"
```

### SSL 証明書のエラー

```bash
# Let's Encrypt の証明書取得ログを確認
bin/kamal proxy logs

# ドメインの DNS 設定を確認
dig your-domain.com

# VPS から Let's Encrypt にアクセスできるか確認
bin/kamal server exec "curl https://acme-v02.api.letsencrypt.org/directory"
```

### コンテナが起動しない

```bash
# コンテナのログを確認
bin/kamal app logs --lines 200

# Docker のイベントログを確認
bin/kamal server exec "docker events --since 10m"

# イメージが正しくプルされているか確認
bin/kamal server exec "docker images"
```

## 🆚 Docker Compose との比較

| 項目 | Kamal | Docker Compose |
|------|-------|----------------|
| デプロイ方式 | Blue-Green（ゼロダウンタイム） | 停止→起動 |
| SSL 設定 | 自動（Let's Encrypt） | 手動（Nginx 設定） |
| ロールバック | 簡単（bin/kamal rollback） | 手動（git checkout + 再デプロイ） |
| 複数サーバー対応 | 対応 | 非対応（Swarm が必要） |
| 設定の複雑さ | シンプル | やや複雑 |
| 学習コスト | 低 | 中 |

## 💡 ベストプラクティス

### 1. 段階的なデプロイ

```bash
# まず staging 環境でテスト
bin/kamal deploy -d staging

# 問題なければ production にデプロイ
bin/kamal deploy -d production
```

### 2. デプロイ前のチェック

```bash
# ローカルでテストを実行
bin/rails test
bundle exec rspec

# Docker イメージをローカルでビルド
bin/kamal build

# 設定ファイルの検証
bin/kamal config
```

### 3. デプロイ後の確認

```bash
# ヘルスチェック
curl https://your-domain.com/up

# ログを確認
bin/kamal app logs --lines 50

# データベース接続を確認
bin/kamal app exec "bin/rails runner 'puts User.count'"
```

## 📚 参考資料

- [Kamal 公式ドキュメント](https://kamal-deploy.org/)
- [Kamal GitHub リポジトリ](https://github.com/basecamp/kamal)
- [Rails ガイド - Production 環境](https://guides.rubyonrails.org/configuring.html#running-in-production)

## 🙋 サポート

問題が発生した場合：

1. このガイドのトラブルシューティングセクションを確認
2. Kamal の公式ドキュメントを確認
3. GitHub Issues で報告

---

**最終更新日**: 2025-12-06
**作成者**: GitHub Copilot
