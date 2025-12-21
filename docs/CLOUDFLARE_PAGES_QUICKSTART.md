# Cloudflare Pages クイックスタートガイド

このガイドでは、Cloudflare Pages へのデプロイを最短で行うための手順を説明します。

## 📋 前提条件

- [x] Cloudflare アカウントを作成済み
- [x] GitHub リポジトリへのアクセス権限
- [x] バックエンド API が稼働中（環境変数設定に必要）

## 🚀 Frontend のデプロイ手順

### 1. Cloudflare Pages プロジェクト作成

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. **Workers & Pages** を選択
3. **Create application** → **Pages** → **Connect to Git**
4. GitHub リポジトリ `osho210/fukuoka_asobi` を選択

### 2. ビルド設定

```yaml
Project name: fukuoka-asobi-frontend
Production branch: main

Framework preset: Next.js
Build command: npm install && cd frontend && npm run build
Build output directory: frontend/.next
Root directory: (空欄 - ルートディレクトリを使用)
```

**代替案（ビルドスクリプト使用）:**
```yaml
Build command: bash scripts/cloudflare-build-frontend.sh
```

### 3. 環境変数の設定

**Settings** → **Environment variables** で以下を設定：

#### Production 環境

| 変数名 | 値（例） |
|--------|---------|
| `NODE_ENV` | `production` |
| `NODE_VERSION` | `20.11.0` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://your-backend.fly.dev` |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | `https://your-backend.fly.dev/graphql` |
| `NEXT_PUBLIC_API_URL` | `https://your-backend.fly.dev/api/v1` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `your-client-id.apps.googleusercontent.com` |

#### Preview 環境

| 変数名 | 値（例） |
|--------|---------|
| `NODE_ENV` | `development` |
| `NODE_VERSION` | `20.11.0` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://your-staging-backend.fly.dev` |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | `https://your-staging-backend.fly.dev/graphql` |
| `NEXT_PUBLIC_API_URL` | `https://your-staging-backend.fly.dev/api/v1` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `your-client-id.apps.googleusercontent.com` |

### 4. デプロイ実行

**Save and Deploy** をクリックすると、自動的にビルドとデプロイが開始されます。

### 5. デプロイ確認

- デプロイが完了したら、`https://fukuoka-asobi-frontend.pages.dev` でアクセス可能
- ビルドログで問題がないか確認

---

## 🔧 Admin のデプロイ手順

### 1. Cloudflare Pages プロジェクト作成

Frontend と同様に、新しいプロジェクトを作成します。

### 2. ビルド設定

```yaml
Project name: fukuoka-asobi-admin
Production branch: main

Framework preset: Next.js
Build command: npm install && cd admin && npm run build
Build output directory: admin/.next
Root directory: (空欄 - ルートディレクトリを使用)
```

**代替案（ビルドスクリプト使用）:**
```yaml
Build command: bash scripts/cloudflare-build-admin.sh
```

### 3. 環境変数の設定

**Settings** → **Environment variables** で以下を設定：

#### Production 環境

| 変数名 | 値（例） |
|--------|---------|
| `NODE_ENV` | `production` |
| `NODE_VERSION` | `20.11.0` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://your-backend.fly.dev` |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | `https://your-backend.fly.dev/graphql` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `your-client-id.apps.googleusercontent.com` |
| `NEXT_PUBLIC_FRONTEND_URL` | `https://fukuoka-asobi.com` |

#### Preview 環境

| 変数名 | 値（例） |
|--------|---------|
| `NODE_ENV` | `development` |
| `NODE_VERSION` | `20.11.0` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://your-staging-backend.fly.dev` |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | `https://your-staging-backend.fly.dev/graphql` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `your-client-id.apps.googleusercontent.com` |
| `NEXT_PUBLIC_FRONTEND_URL` | `https://fukuoka-asobi-frontend.pages.dev` |

---

## 🔒 バックエンド（Rails）の設定更新

### CORS 設定

`backend/config/initializers/cors.rb` で、Cloudflare Pages ドメインが既に追加されています：

```ruby
origins "https://fukuoka-asobi.com",
        "https://www.fukuoka-asobi.com",
        "http://localhost:8200",
        "http://localhost:9200",
        "https://fukuoka-asobi.vercel.app",        # 移行期間中
        "https://fukuoka-asobi-frontend.pages.dev", # Cloudflare Pages
        "https://fukuoka-asobi-admin.pages.dev"     # Cloudflare Pages
```

バックエンドを再起動して設定を適用してください。

---

## 🌐 Google OAuth の設定

### リダイレクト URI の追加

[Google Cloud Console](https://console.cloud.google.com/) で以下を追加：

#### 承認済みの JavaScript 生成元
```
https://fukuoka-asobi-frontend.pages.dev
https://fukuoka-asobi-admin.pages.dev
```

#### 承認済みのリダイレクト URI
```
https://fukuoka-asobi-frontend.pages.dev/auth/callback
https://fukuoka-asobi-admin.pages.dev/auth/callback
```

---

## ✅ 動作確認チェックリスト

### Frontend

- [ ] トップページが表示される
- [ ] GraphQL クエリが正常に動作する
- [ ] Google OAuth ログインができる
- [ ] 画像が正しく表示される
- [ ] API リクエストが正常に動作する

### Admin

- [ ] 管理画面が表示される
- [ ] Google OAuth ログインができる
- [ ] CRUD 操作が正常に動作する
- [ ] 画像アップロードができる

---

## 🎯 カスタムドメインの設定（オプション）

### Frontend: `fukuoka-asobi.com`

1. Cloudflare Pages Dashboard → **Custom domains**
2. **Add a custom domain** をクリック
3. `fukuoka-asobi.com` を入力
4. DNS レコードが自動的に設定される（Cloudflare DNS 使用時）

### Admin: `admin.fukuoka-asobi.com`

同様の手順で `admin.fukuoka-asobi.com` を設定。

---

## 📚 詳細ガイド

より詳しい情報は以下のドキュメントを参照してください：

- **[完全な移行ガイド](CLOUDFLARE_PAGES_MIGRATION.md)** - 詳細な手順とトラブルシューティング
- **[移行チェックリスト](CLOUDFLARE_PAGES_MIGRATION_CHECKLIST.md)** - フェーズ別タスク管理
- **[ビルド設定ガイド](CLOUDFLARE_PAGES_BUILD_CONFIGURATION.md)** - npm workspaces の詳細
- **[Vercel vs Cloudflare Pages 比較](VERCEL_VS_CLOUDFLARE_COMPARISON.md)** - 機能比較

---

## 🆘 トラブルシューティング

### ビルドが失敗する

**エラー: `Cannot find module 'next'`**

→ `frontend/package.json` または `admin/package.json` に `next` が明示的に定義されているか確認してください。

**エラー: `GraphQL CodeGen` の型が見つからない**

→ 生成されたファイル（`src/__generated__/`）がコミットされているか確認してください。

### 環境変数が反映されない

1. Cloudflare Dashboard で環境変数を再確認
2. Production / Preview の切り替えが正しいか確認
3. 再デプロイを実行

### CORS エラーが発生する

1. バックエンドの CORS 設定を確認
2. Cloudflare Pages のドメインが含まれているか確認
3. Rails を再起動

---

**最終更新**: 2024-12-14
