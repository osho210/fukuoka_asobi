# 本番環境 Docker 構成の変更点まとめ

このドキュメントでは、ConoHa VPS への本番デプロイ対応として実施した変更内容をまとめています。

## 📝 変更ファイル一覧

### 新規作成

1. **docker-compose.prod.yml**
   - 本番環境用の Docker Compose 設定ファイル
   - MySQL、MinIO、Rails バックエンドの構成

2. **.env.example**
   - 環境変数のテンプレートファイル
   - 必要な環境変数と説明を記載

3. **DEPLOYMENT_GUIDE_VPS.md**
   - VPS デプロイの詳細ガイド
   - セットアップ手順、運用コマンド、トラブルシューティングを網羅

4. **PRODUCTION_DOCKER_CHANGES.md**（このファイル）
   - 変更内容のサマリー

### 更新

1. **backend/Dockerfile**
   - sqlite3 パッケージを削除
   - MySQL クライアントライブラリ（default-libmysqlclient-dev）を追加
   - BUNDLE_WITHOUT に "development test" を設定

2. **README.md**
   - VPS デプロイオプションのセクションを追加
   - インフラ構成の説明を更新

## 🔑 主な変更点

### 1. 開発環境と本番環境の分離

- **開発環境**: `docker-compose.yml`（既存）
- **本番環境**: `docker-compose.prod.yml`（新規）

この分離により、開発と本番で異なる設定を明確に管理できます。

### 2. セキュリティの強化

#### ポート公開の制限

```yaml
# 本番環境では MySQL と MinIO のポートを公開しない
# Docker ネットワーク経由でのみアクセス可能
```

- MySQL (3306): コメントアウト
- MinIO (9000, 9001): コメントアウト
- Backend (80): 公開（Nginx リバースプロキシ経由を推奨）

#### 認証情報の管理

- デフォルトパスワードの削除
- 環境変数での強力なパスワード設定を必須化
- MySQL ヘルスチェックでのパスワード露出を防止

### 3. 環境変数による設定管理

`.env.example` をベースに `.env` ファイルを作成し、以下を設定：

```env
RAILS_MASTER_KEY=<your_key>
SECRET_KEY_BASE=<generated_secret>
DB_USERNAME=fukuoka_asobi
DB_PASSWORD=<secure_password>
MINIO_ROOT_USER=<username>
MINIO_ROOT_PASSWORD=<secure_password>
```

### 4. Nginx リバースプロキシの推奨

本番環境では、以下の理由から Nginx リバースプロキシの使用を推奨：

- SSL/TLS 終端
- セキュリティヘッダーの追加
- ロードバランシング
- レート制限

設定例は `DEPLOYMENT_GUIDE_VPS.md` に記載。

## 📋 デプロイフロー

### 初回デプロイ

```bash
# 1. リポジトリのクローン
git clone https://github.com/osho210/fukuoka_asobi.git
cd fukuoka_asobi

# 2. 環境変数の設定
cp .env.example .env
nano .env  # 環境変数を設定

# 3. イメージのビルド
docker compose -f docker-compose.prod.yml build

# 4. DB と MinIO を起動
docker compose -f docker-compose.prod.yml up -d db minio

# 5. データベースのセットアップ
docker compose -f docker-compose.prod.yml run --rm backend rails db:setup

# 6. バックエンドを起動
docker compose -f docker-compose.prod.yml up -d backend
```

### 更新デプロイ

```bash
# 1. 最新コードを取得
git pull origin main

# 2. イメージを再ビルド
docker compose -f docker-compose.prod.yml build backend

# 3. マイグレーション実行
docker compose -f docker-compose.prod.yml run --rm backend rails db:migrate

# 4. バックエンドを再起動
docker compose -f docker-compose.prod.yml up -d backend
```

## 🔍 検証済み項目

### 構文チェック

- ✅ docker-compose.prod.yml の YAML 構文
- ✅ Dockerfile の構文
- ✅ .env.example のフォーマット

### セキュリティチェック

- ✅ CodeQL による脆弱性スキャン
- ✅ コードレビューでのセキュリティ指摘対応
  - MySQL ヘルスチェックでのパスワード露出を修正
  - 不要なポート公開を削除
  - デフォルト認証情報を削除

### 設定検証

- ✅ database.yml が環境変数を使用していることを確認
- ✅ Gemfile に mysql2 gem が含まれていることを確認
- ✅ Dockerfile に MySQL クライアントライブラリが含まれていることを確認

## 📚 関連ドキュメント

- **デプロイガイド**: [DEPLOYMENT_GUIDE_VPS.md](./DEPLOYMENT_GUIDE_VPS.md)
- **環境変数テンプレート**: [.env.example](./.env.example)
- **README**: [README.md](./README.md)（VPS デプロイセクション）
- **既存のデプロイチェックリスト**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)（Fly.io/Vercel 向け）

## 🎯 次のステップ

1. **VPS サーバーの準備**
   - ConoHa VPS などのサーバーを用意
   - Docker と Docker Compose をインストール

2. **SSL 証明書の取得**
   - Let's Encrypt を使用した証明書取得
   - Nginx での SSL 終端設定

3. **モニタリングの設定**
   - ログ管理
   - リソース監視
   - アラート設定

4. **バックアップ戦略の策定**
   - データベースの定期バックアップ
   - ボリュームのスナップショット

## ⚠️ 注意事項

1. **`.env` ファイルは Git にコミットしない**
   - `.gitignore` で除外済み
   - 秘匿情報が含まれるため厳重に管理

2. **強力なパスワードを使用**
   - 最低 16 文字以上を推奨
   - 英数字と記号を組み合わせる

3. **Nginx リバースプロキシは必須**
   - 本番環境では必ず使用する
   - HTTP から HTTPS へのリダイレクト設定

4. **定期的なアップデート**
   - Docker イメージの更新
   - Rails 依存関係の更新
   - OS セキュリティパッチの適用

## 🙋 サポート

質問や問題が発生した場合：

1. このドキュメントのトラブルシューティングセクションを確認
2. [DEPLOYMENT_GUIDE_VPS.md](./DEPLOYMENT_GUIDE_VPS.md) のトラブルシューティングを確認
3. GitHub Issues で報告

---

**最終更新日**: 2025-12-06  
**作成者**: GitHub Copilot  
**関連 PR**: #[PR番号]
