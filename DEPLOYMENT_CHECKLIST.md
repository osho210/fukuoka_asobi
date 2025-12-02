# デプロイチェックリスト

このチェックリストに従って、福岡あそびアプリケーションをデプロイしてください。

## 事前準備

- [ ] GitHubリポジトリが最新の状態になっている
- [ ] ローカルで動作確認が完了している
- [ ] 各サービスのアカウントを作成済み
  - [ ] TiDB Cloud
  - [ ] Cloudflare（R2有効化済み）
  - [ ] Fly.io
  - [ ] Vercel

---

## 1. TiDB Cloud（データベース）

- [ ] TiDB Cloudにログイン
- [ ] Serverless Tierでクラスター作成
  - クラスター名: `fukuoka-asobi-prod`
  - リージョン: `ap-northeast-1`（東京）
- [ ] 接続情報を記録
  - Host: `____________`
  - Port: `4000`
  - Username: `____________`
  - Password: `____________`
- [ ] データベースを作成
  ```sql
  CREATE DATABASE fukuoka_asobi_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE DATABASE fukuoka_asobi_production_cache CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE DATABASE fukuoka_asobi_production_queue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE DATABASE fukuoka_asobi_production_cable CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

---

## 2. Cloudflare R2（ストレージ）

- [ ] Cloudflareダッシュボードにログイン
- [ ] R2バケットを作成
  - バケット名: `fukuoka-asobi`
  - リージョン: Asia Pacific
- [ ] バケットを公開設定にする
- [ ] API トークンを作成
  - Access Key ID: `____________`
  - Secret Access Key: `____________`
  - Endpoint: `____________`

---

## 3. Fly.io（バックエンド）

### 3.1 初期セットアップ

- [ ] flyctlをインストール
  ```bash
  brew install flyctl
  ```
- [ ] Fly.ioにログイン
  ```bash
  flyctl auth login
  ```

### 3.2 アプリケーション作成

- [ ] backendディレクトリに移動
  ```bash
  cd backend
  ```
- [ ] アプリケーションを初期化
  ```bash
  flyctl launch
  ```
  - App Name: `fukuoka-asobi-backend`
  - Region: `nrt` (Tokyo)
  - PostgreSQL: `No`
  - Redis: `No`

### 3.3 環境変数の設定

- [ ] SECRET_KEY_BASEを生成
  ```bash
  bundle exec rails secret
  ```
  生成された値: `____________`

- [ ] 環境変数を設定
  ```bash
  # データベース
  flyctl secrets set \
    DB_HOST=xxx.clusters.tidb-cloud.com \
    DB_PORT=4000 \
    DB_USERNAME=xxx \
    DB_PASSWORD=xxx \
    DB_NAME=fukuoka_asobi_production

  # R2
  flyctl secrets set \
    R2_ACCESS_KEY_ID=xxx \
    R2_SECRET_ACCESS_KEY=xxx \
    R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com \
    R2_BUCKET_NAME=fukuoka-asobi

  # Rails
  flyctl secrets set \
    SECRET_KEY_BASE=xxx \
    RAILS_MASTER_KEY=$(cat config/master.key)

  # その他
  flyctl secrets set \
    APP_HOST=fukuoka-asobi-backend.fly.dev
  ```

### 3.4 デプロイ

- [ ] デプロイを実行
  ```bash
  flyctl deploy
  ```
- [ ] デプロイ成功を確認
- [ ] マイグレーションを実行
  ```bash
  flyctl ssh console -C "bin/rails db:migrate"
  ```
- [ ] ヘルスチェック
  ```bash
  curl https://fukuoka-asobi-backend.fly.dev/up
  ```

---

## 4. Vercel（フロントエンド）

> **重要**: このプロジェクトは npm workspaces を使用しています。
> `frontend/package.json` と `admin/package.json` には明示的なバージョン番号が指定されており、
> Vercel が Next.js を正しく検出できるようになっています。

### 4.1 Frontend（ユーザー向けサイト）

- [ ] Vercelにログイン
- [ ] New Projectをクリック
- [ ] GitHubリポジトリを選択
- [ ] プロジェクト設定
  - Project Name: `fukuoka-asobi-frontend`
  - Root Directory: `frontend` （必須）
  - Build Command: `npm run build` （デフォルトでOK）
  - Install Command: `npm install` （デフォルトでOK）
- [ ] 環境変数を設定
  ```
  NEXT_PUBLIC_BACKEND_URL=https://fukuoka-asobi-backend.fly.dev
  NODE_ENV=production
  ```
- [ ] デプロイを実行
- [ ] デプロイ成功後、URLを記録
  - URL: `____________`

### 4.2 Admin（管理画面）

- [ ] Vercelで New Project
- [ ] 同じGitHubリポジトリを選択
- [ ] プロジェクト設定
  - Project Name: `fukuoka-asobi-admin`
  - Root Directory: `admin` （必須）
  - Build Command: `npm run build` （デフォルトでOK）
  - Install Command: `npm install` （デフォルトでOK）
- [ ] 環境変数を設定
  ```
  NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://fukuoka-asobi-backend.fly.dev/graphql
  NEXT_PUBLIC_BACKEND_URL=https://fukuoka-asobi-backend.fly.dev
  NODE_ENV=production
  ```
- [ ] デプロイを実行
- [ ] デプロイ成功後、URLを記録
  - URL: `____________`

---

## 5. CORS設定の更新

- [ ] Vercelの実際のURLでFly.ioの環境変数を更新
  ```bash
  cd backend
  flyctl secrets set \
    FRONTEND_URL=https://your-frontend-url.vercel.app \
    ADMIN_URL=https://your-admin-url.vercel.app
  ```

---

## 6. 動作確認

### 6.1 バックエンド

- [ ] ヘルスチェック
  ```bash
  curl https://fukuoka-asobi-backend.fly.dev/up
  ```
- [ ] GraphQL疎通確認
  ```bash
  curl -X POST https://fukuoka-asobi-backend.fly.dev/graphql \
    -H "Content-Type: application/json" \
    -d '{"query": "{ __typename }"}'
  ```

### 6.2 フロントエンド

- [ ] フロントエンドにアクセス
- [ ] ページが正常に表示される
- [ ] データの取得ができる
- [ ] 画像が表示される

### 6.3 管理画面

- [ ] 管理画面にアクセス
- [ ] ログインができる
- [ ] データの登録ができる
- [ ] 画像のアップロードができる
- [ ] アップロードした画像が表示される

---

## 7. 初期データの投入

- [ ] Fly.ioコンソールに接続
  ```bash
  flyctl ssh console
  ```
- [ ] シードデータを投入
  ```bash
  bin/rails db:seed
  ```

---

## トラブルシューティング

### デプロイが失敗する場合

1. ログを確認
   ```bash
   flyctl logs
   ```

2. 環境変数を確認
   ```bash
   flyctl secrets list
   ```

3. ローカルでビルドテスト
   ```bash
   docker build -t fukuoka-asobi-backend .
   ```

### データベース接続エラー

- TiDB Cloudの接続情報を再確認
- ファイアウォール設定を確認
- DB_HOSTにポート番号が含まれていないか確認

### CORS エラー

- FRONTEND_URLとADMIN_URLが正しく設定されているか確認
- Vercelの実際のURLと一致しているか確認

### 画像が表示されない

- R2バケットが公開設定になっているか確認
- R2の環境変数が正しいか確認
- Next.jsのremotePatterns設定を確認

---

## デプロイ完了後の URL

記録しておきましょう：

- **Frontend**: `____________`
- **Admin**: `____________`
- **Backend**: `https://fukuoka-asobi-backend.fly.dev`

---

## 次のステップ

- [ ] カスタムドメインの設定（必要に応じて）
- [ ] SSL証明書の確認（自動設定済み）
- [ ] モニタリングの設定
- [ ] バックアップ計画の策定
- [ ] チーム権限の設定

---

詳細な手順は `docs/deployment_guide.md` を参照してください。
