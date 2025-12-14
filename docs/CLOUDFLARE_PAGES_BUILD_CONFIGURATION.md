# Cloudflare Pages ビルド設定ガイド

このドキュメントは、Cloudflare Pages でのビルド設定について詳しく説明します。

## 📋 目次

- [npm Workspaces について](#npm-workspaces-について)
- [Frontend ビルド設定](#frontend-ビルド設定)
- [Admin ビルド設定](#admin-ビルド設定)
- [トラブルシューティング](#トラブルシューティング)
- [ビルドの最適化](#ビルドの最適化)

## npm Workspaces について

このプロジェクトは **npm workspaces** を使用したモノレポ構成になっています。

```
fukuoka-asobi/
├── package.json          # ルート（workspaces 定義）
├── package-lock.json     # ロックファイル
├── frontend/
│   ├── package.json      # Frontend の依存関係
│   └── ...
└── admin/
    ├── package.json      # Admin の依存関係
    └── ...
```

### Workspaces の依存関係管理

- **ルートの package.json** に共通の依存関係（Next.js, React, GraphQL など）を定義
- **各ワークスペースの package.json** にもバージョンを明示的に記載（Vercel/Cloudflare Pages 対応）
- `npm install` はルートで実行すると、全ワークスペースの依存関係がインストールされる

### なぜ各ワークスペースに依存関係を明記するか

```json
// ❌ 以前の構成（Cloudflare Pages で失敗）
{
  "dependencies": {
    "next": "*",  // ワイルドカード（ローカルでは動作）
    "react": "*"
  }
}

// ✅ 現在の構成（Cloudflare Pages 対応）
{
  "dependencies": {
    "next": "15.3.8",  // 明示的なバージョン
    "react": "^19.0.0"
  }
}
```

**理由**: Cloudflare Pages はルートディレクトリを指定できないため、各ワークスペースの `package.json` を直接参照します。ワイルドカード `*` は有効なバージョンとして認識されません。

## Frontend ビルド設定

### Cloudflare Pages Dashboard での設定

#### プロジェクト基本情報

```
Project name: fukuoka-asobi-frontend
Production branch: main
Preview branches: All non-production branches
```

#### ビルド設定

```yaml
Framework preset: Next.js

Build command:
  npm install && cd frontend && npm run build

Build output directory:
  frontend/.next

Root directory:
  (空欄 - ルートディレクトリを使用)
```

### ビルドコマンドの詳細

#### 方法 1: シンプルな方法（推奨）

```bash
npm install && cd frontend && npm run build
```

**動作の流れ:**
1. `npm install`: ルートで実行され、全ワークスペースの依存関係をインストール
2. `cd frontend`: frontend ディレクトリに移動
3. `npm run build`: frontend の `package.json` の build スクリプトを実行

#### 方法 2: 明示的な方法

```bash
npm install --include-workspace-root && npm run build -w frontend
```

**動作の流れ:**
1. `npm install --include-workspace-root`: ルートとすべてのワークスペースをインストール
2. `npm run build -w frontend`: frontend ワークスペースのビルドを実行

### 環境変数

Cloudflare Pages Dashboard → Settings → Environment variables で設定:

#### Production

| 変数名 | 値（例） |
|--------|---------|
| `NODE_ENV` | `production` |
| `NODE_VERSION` | `20.11.0` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://api.fukuoka-asobi.com` |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | `https://api.fukuoka-asobi.com/graphql` |
| `NEXT_PUBLIC_API_URL` | `https://api.fukuoka-asobi.com/api/v1` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `your-client-id.apps.googleusercontent.com` |

#### Preview

| 変数名 | 値（例） |
|--------|---------|
| `NODE_ENV` | `development` |
| `NODE_VERSION` | `20.11.0` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://staging-api.fukuoka-asobi.com` |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | `https://staging-api.fukuoka-asobi.com/graphql` |
| `NEXT_PUBLIC_API_URL` | `https://staging-api.fukuoka-asobi.com/api/v1` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `your-client-id.apps.googleusercontent.com` |

### ビルド出力ディレクトリ

```
frontend/.next
```

Cloudflare Pages は、このディレクトリ内のファイルを配信します。

## Admin ビルド設定

### Cloudflare Pages Dashboard での設定

#### プロジェクト基本情報

```
Project name: fukuoka-asobi-admin
Production branch: main
Preview branches: All non-production branches
```

#### ビルド設定

```yaml
Framework preset: Next.js

Build command:
  npm install && cd admin && npm run build

Build output directory:
  admin/.next

Root directory:
  (空欄 - ルートディレクトリを使用)
```

### ビルドコマンドの詳細

#### 方法 1: シンプルな方法（推奨）

```bash
npm install && cd admin && npm run build
```

**動作の流れ:**
1. `npm install`: ルートで実行され、全ワークスペースの依存関係をインストール
2. `cd admin`: admin ディレクトリに移動
3. `npm run build`: admin の `package.json` の build スクリプトを実行

#### 方法 2: 明示的な方法

```bash
npm install --include-workspace-root && npm run build -w admin
```

### 環境変数

#### Production

| 変数名 | 値（例） |
|--------|---------|
| `NODE_ENV` | `production` |
| `NODE_VERSION` | `20.11.0` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://api.fukuoka-asobi.com` |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | `https://api.fukuoka-asobi.com/graphql` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `your-client-id.apps.googleusercontent.com` |
| `NEXT_PUBLIC_FRONTEND_URL` | `https://fukuoka-asobi.com` |

#### Preview

| 変数名 | 値（例） |
|--------|---------|
| `NODE_ENV` | `development` |
| `NODE_VERSION` | `20.11.0` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://staging-api.fukuoka-asobi.com` |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | `https://staging-api.fukuoka-asobi.com/graphql` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `your-client-id.apps.googleusercontent.com` |
| `NEXT_PUBLIC_FRONTEND_URL` | `https://fukuoka-asobi-frontend.pages.dev` |

### ビルド出力ディレクトリ

```
admin/.next
```

## トラブルシューティング

### ビルドエラー: `Cannot find module 'next'`

**原因**: `next` が dependencies に定義されていない

**解決策**:
1. `frontend/package.json` または `admin/package.json` を確認
2. `dependencies` に `next` が明示的に定義されているか確認
   ```json
   {
     "dependencies": {
       "next": "15.3.8",
       "react": "^19.0.0",
       "react-dom": "^19.0.0"
     }
   }
   ```

### ビルドエラー: `GraphQL CodeGen` の型が見つからない

**原因**: 生成されたファイルがコミットされていない

**解決策**:
1. ローカルで GraphQL CodeGen を実行
   ```bash
   cd frontend
   npm run generate
   ```
2. 生成されたファイルをコミット
   ```bash
   git add frontend/src/__generated__
   git commit -m "graphql: 生成ファイルを追加"
   ```

### ビルドエラー: `npm install` が失敗する

**原因**: `package-lock.json` が正しくない

**解決策**:
1. ローカルで依存関係を再インストール
   ```bash
   rm -rf node_modules package-lock.json
   rm -rf frontend/node_modules admin/node_modules
   npm install
   ```
2. 新しい `package-lock.json` をコミット
   ```bash
   git add package-lock.json
   git commit -m "build: package-lock.json を再生成"
   ```

### ビルド時間が長い

**原因**: キャッシュが効いていない、または依存関係が多い

**解決策**:
1. Cloudflare Pages のキャッシュ設定を確認
2. 不要な依存関係を削除
3. ビルドスクリプトを最適化

### 環境変数が反映されない

**原因**: 環境変数の設定が正しくない、またはキャッシュが古い

**解決策**:
1. Cloudflare Dashboard で環境変数を再確認
   - Production / Preview の切り替えが正しいか
   - 変数名のスペルミスがないか
2. 再デプロイを実行
   - "Retry deployment" ボタンをクリック
3. キャッシュをクリア
   - "Clear cache and redeploy" を実行

## ビルドの最適化

### 1. GraphQL CodeGen の事前実行

**現在の方法（推奨）**:
- GraphQL CodeGen はローカルで事前に実行
- 生成されたファイル（`src/__generated__/`）をコミット
- ビルド時には CodeGen を実行しない

**メリット**:
- ビルド時間の短縮
- ビルドの安定性向上（バックエンドが稼働していなくてもビルド可能）

### 2. Node.js バージョンの固定

`.node-version` ファイルでバージョンを指定:

```
20.11.0
```

または環境変数で指定:

```
NODE_VERSION=20.11.0
```

**メリット**:
- ビルド環境の一貫性
- Node.js バージョンの自動アップデートを防ぐ

### 3. 依存関係のキャッシュ

Cloudflare Pages は自動的に `node_modules` をキャッシュします。

**キャッシュをクリアする場合**:
- Cloudflare Dashboard → Deployments
- "Clear cache and redeploy" を実行

### 4. 並列ビルドの無効化（必要に応じて）

複数のプロジェクト（Frontend と Admin）を同時にビルドする場合、リソース制限に注意:

```bash
# 順次ビルド（推奨）
npm install && cd frontend && npm run build
npm install && cd admin && npm run build
```

## ローカルでの検証

Cloudflare Pages にデプロイする前に、ローカルで同じビルドコマンドを実行して検証:

### Frontend

```bash
# ルートディレクトリで実行
npm install
cd frontend
npm run build

# ビルドが成功したか確認
ls -la .next/
```

### Admin

```bash
# ルートディレクトリで実行
npm install
cd admin
npm run build

# ビルドが成功したか確認
ls -la .next/
```

### ビルド時間の確認

```bash
time npm run build
```

**目安**:
- Frontend: 1-3分
- Admin: 1-3分

Cloudflare Pages の無料プランでは、**月間 500回のビルド**が可能です。

## まとめ

### Frontend ビルド設定

```yaml
Build command: npm install && cd frontend && npm run build
Build output directory: frontend/.next
Root directory: (空欄)
NODE_VERSION: 20.11.0
```

### Admin ビルド設定

```yaml
Build command: npm install && cd admin && npm run build
Build output directory: admin/.next
Root directory: (空欄)
NODE_VERSION: 20.11.0
```

### 重要なポイント

✅ **npm workspaces 対応**: ルートで `npm install` を実行
✅ **依存関係の明示**: 各ワークスペースの `package.json` にバージョンを記載
✅ **GraphQL CodeGen**: 事前実行してコミット
✅ **Node.js バージョン**: `.node-version` で固定
✅ **環境変数**: Production / Preview で異なる値を設定

### 参考リンク

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Deploy a Next.js site](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [npm Workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
