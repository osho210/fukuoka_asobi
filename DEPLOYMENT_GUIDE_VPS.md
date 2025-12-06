# ConoHa VPS 本番環境デプロイガイド

このガイドでは、ConoHa VPS 上で Docker を使用して本番環境を構築する手順を説明します。

## 📋 前提条件

- ConoHa VPS サーバーが起動していること
- Docker と Docker Compose がインストールされていること
- Git がインストールされていること
- `config/master.key` ファイルを保持していること

## 🔧 初期セットアップ

### 1. リポジトリのクローン

```bash
# アプリケーションディレクトリに移動
cd /var/www

# リポジトリをクローン
git clone https://github.com/osho210/fukuoka_asobi.git
cd fukuoka_asobi

# 本番用ブランチをチェックアウト（必要に応じて）
git checkout main
```

### 2. 環境変数の設定

`.env` ファイルを作成して環境変数を設定します：

```bash
# .env.example をコピー
cp .env.example .env

# .env ファイルを編集
nano .env
```

`.env` ファイルに以下の値を設定してください：

```env
# Rails マスターキー（backend/config/master.key の内容）
RAILS_MASTER_KEY=<あなたの master.key の内容>

# Rails シークレットキーベース（以下のコマンドで生成）
# cd backend && bundle exec rails secret
SECRET_KEY_BASE=<生成したシークレットキー>

# データベース設定
DB_USERNAME=fukuoka_asobi
DB_PASSWORD=<安全なパスワード>
DB_NAME=fukuoka_asobi_production
DB_ROOT_PASSWORD=<安全な root パスワード>

# MinIO 設定
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=<安全なパスワード>
```

**重要**: `.env` ファイルは Git にコミットしないでください。`.gitignore` で除外されています。

### 3. Docker ボリュームの準備（オプション）

外部ボリュームを使用する場合は、事前に作成できます：

```bash
# MySQL データ用ボリュームを作成
docker volume create fukuoka_asobi_mysql_data_prod

# MinIO データ用ボリュームを作成
docker volume create minio_data_prod

# Rails ストレージ用ボリュームを作成
docker volume create rails_storage_prod
```

**注意**: `docker-compose.prod.yml` では `external: false` に設定されているため、
ボリュームを事前に作成しなくても Docker Compose が自動的に作成します。

## 🚀 デプロイ手順

### Step 1: イメージのビルド

```bash
docker compose -f docker-compose.prod.yml build
```

このコマンドで本番用の Docker イメージがビルドされます。

### Step 2: データベースとストレージの起動

```bash
docker compose -f docker-compose.prod.yml up -d db minio
```

データベースとオブジェクトストレージが起動します。
ヘルスチェックが完了するまで待ちます（約 10〜30 秒）。

### Step 3: データベースのセットアップ

初回デプロイ時のみ、データベースのセットアップを実行します：

```bash
docker compose -f docker-compose.prod.yml run --rm backend rails db:setup
```

**既にデータベースが存在する場合**（マイグレーションのみ実行）：

```bash
docker compose -f docker-compose.prod.yml run --rm backend rails db:migrate
```

### Step 4: バックエンドの起動

```bash
docker compose -f docker-compose.prod.yml up -d backend
```

これでバックエンドサーバーがポート 80 で起動します。

### Step 5: 動作確認

```bash
# コンテナの状態を確認
docker compose -f docker-compose.prod.yml ps

# バックエンドのログを確認
docker compose -f docker-compose.prod.yml logs backend

# ヘルスチェック
curl http://localhost/up
```

## 🔄 更新デプロイ

アプリケーションを更新する場合：

```bash
# 最新のコードを取得
git pull origin main

# イメージを再ビルド
docker compose -f docker-compose.prod.yml build backend

# マイグレーションを実行（必要な場合）
docker compose -f docker-compose.prod.yml run --rm backend rails db:migrate

# アセットをプリコンパイル（イメージビルド時に自動実行されます）
# docker compose -f docker-compose.prod.yml run --rm backend rails assets:precompile

# バックエンドを再起動
docker compose -f docker-compose.prod.yml up -d backend
```

## 🛠️ よく使うコマンド

### サービスの起動・停止

```bash
# 全サービスを起動
docker compose -f docker-compose.prod.yml up -d

# 全サービスを停止
docker compose -f docker-compose.prod.yml down

# バックエンドのみ再起動
docker compose -f docker-compose.prod.yml restart backend
```

### ログの確認

```bash
# 全サービスのログを表示
docker compose -f docker-compose.prod.yml logs

# バックエンドのログのみ表示
docker compose -f docker-compose.prod.yml logs backend

# ログをリアルタイムで監視
docker compose -f docker-compose.prod.yml logs -f backend
```

### Rails コンソール

```bash
docker compose -f docker-compose.prod.yml run --rm backend rails console
```

### データベース操作

```bash
# MySQL コンソールに接続
docker compose -f docker-compose.prod.yml exec db mysql -u fukuoka_asobi -p fukuoka_asobi_production

# データベースのバックアップ
docker compose -f docker-compose.prod.yml exec db mysqldump -u fukuoka_asobi -p fukuoka_asobi_production > backup.sql

# データベースのリストア
docker compose -f docker-compose.prod.yml exec -T db mysql -u fukuoka_asobi -p fukuoka_asobi_production < backup.sql
```

### コンテナ内でコマンドを実行

```bash
# バックエンドコンテナで bash を起動
docker compose -f docker-compose.prod.yml exec backend bash

# ワンライナーでコマンドを実行
docker compose -f docker-compose.prod.yml exec backend bin/rails db:migrate:status
```

## 🔒 セキュリティ上の注意

1. **環境変数の管理**
   - `.env` ファイルは Git にコミットしない
   - パスワードは強力なものを使用する
   - `RAILS_MASTER_KEY` は厳重に管理する

2. **ファイアウォール設定**
   - 必要なポートのみを公開する
   - MySQL (3306) は外部から直接アクセスできないようにする
   - HTTP (80) / HTTPS (443) のみを公開

3. **定期的なアップデート**
   - Docker イメージを定期的に更新する
   - Rails の依存関係を定期的に更新する

## 📊 モニタリング

### リソース使用状況の確認

```bash
# コンテナのリソース使用状況
docker stats

# ディスク使用状況
docker system df
```

### ヘルスチェック

```bash
# アプリケーションのヘルスチェック
curl http://localhost/up

# データベース接続確認
docker compose -f docker-compose.prod.yml exec backend rails runner "puts ActiveRecord::Base.connection.execute('SELECT 1').to_a"
```

## 🐛 トラブルシューティング

### データベース接続エラー

```bash
# データベースコンテナのログを確認
docker compose -f docker-compose.prod.yml logs db

# データベースの接続設定を確認
docker compose -f docker-compose.prod.yml exec backend env | grep DB_
```

### アセットが見つからない

```bash
# アセットを再プリコンパイル
docker compose -f docker-compose.prod.yml run --rm backend rails assets:precompile

# イメージを再ビルド（アセットはビルド時にコンパイルされます）
docker compose -f docker-compose.prod.yml build backend
docker compose -f docker-compose.prod.yml up -d backend
```

### RAILS_MASTER_KEY エラー

```bash
# 環境変数が正しく設定されているか確認
docker compose -f docker-compose.prod.yml config

# .env ファイルを明示的に指定して起動
docker compose -f docker-compose.prod.yml --env-file .env up -d
```

### コンテナが起動しない

```bash
# 詳細なログを確認
docker compose -f docker-compose.prod.yml logs backend

# イメージを再ビルド
docker compose -f docker-compose.prod.yml build --no-cache backend

# ボリュームをクリアして再起動
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up -d
```

## 🔄 バックアップとリストア

### データベースのバックアップ

```bash
# 日付付きバックアップファイルを作成
docker compose -f docker-compose.prod.yml exec db mysqldump \
  -u fukuoka_asobi \
  -p"${DB_PASSWORD}" \
  fukuoka_asobi_production \
  > backup_$(date +%Y%m%d_%H%M%S).sql
```

### ボリュームのバックアップ

```bash
# MySQL データをバックアップ
docker run --rm \
  -v fukuoka_asobi_mysql_data_prod:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/mysql_backup.tar.gz -C /data .

# MinIO データをバックアップ
docker run --rm \
  -v minio_data_prod:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/minio_backup.tar.gz -C /data .
```

## 📚 参考資料

- [Docker Compose ドキュメント](https://docs.docker.com/compose/)
- [Rails プロダクションガイド](https://guides.rubyonrails.org/configuring.html#running-in-production)
- [MySQL 8.0 ドキュメント](https://dev.mysql.com/doc/refman/8.0/ja/)
- [MinIO ドキュメント](https://min.io/docs/minio/linux/index.html)

## 📞 サポート

問題が発生した場合は、以下を確認してください：

1. このガイドのトラブルシューティングセクション
2. GitHub Issues
3. プロジェクトの README.md
