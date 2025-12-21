# Cloudflare Pages デプロイエラーの修正

## 🐛 エラー概要

```
✘ [ERROR] Missing entry-point to Worker script or to assets directory
Failed: error occurred while running deploy command
```

**原因**: デプロイコマンドとして `npx wrangler versions upload` が使用されているが、これは **Cloudflare Workers 用のコマンド**であり、**Cloudflare Pages には適用できません**。

## ✅ 正しい設定方法

### 方法 1: GitHub 連携（推奨）

Cloudflare Pages は **GitHub 連携による自動デプロイ**が推奨されています。

#### Cloudflare Pages Dashboard での設定

##### Frontend プロジェクト設定

```yaml
Project name: fukuoka-asobi-frontend
Production branch: main

Build settings:
  Framework preset: Next.js
  Build command: npm install && cd frontend && npm run build
  Build output directory: frontend/.next
  Root directory: (空欄 - ルートを使用)
```

##### Admin プロジェクト設定

```yaml
Project name: fukuoka-asobi-admin
Production branch: main

Build settings:
  Framework preset: Next.js
  Build command: npm install && cd admin && npm run build
  Build output directory: admin/.next
  Root directory: (空欄 - ルートを使用)
```

#### ビルドコマンドの説明

**重要**: Cloudflare Pages では以下のコマンドのみを設定します：

```bash
# Frontend
npm install && cd frontend && npm run build

# Admin
npm install && cd admin && npm run build
```

**デプロイコマンドは不要です**。Cloudflare Pages が自動的にビルド出力をデプロイします。

### 方法 2: Wrangler CLI で直接デプロイ

ローカルからデプロイする場合は、`wrangler pages deploy` コマンドを使用します。

#### Frontend のデプロイ

```bash
# ビルド
cd frontend
npm run build

# デプロイ
npx wrangler pages deploy .next --project-name=fukuoka-asobi-frontend
```

#### Admin のデプロイ

```bash
# ビルド
cd admin
npm run build

# デプロイ
npx wrangler pages deploy .next --project-name=fukuoka-asobi-admin
```

### 方法 3: package.json にスクリプトを追加

ルートの `package.json` にデプロイスクリプトを追加することもできます：

```json
{
  "scripts": {
    "deploy:frontend": "cd frontend && npm run build && npx wrangler pages deploy .next --project-name=fukuoka-asobi-frontend",
    "deploy:admin": "cd admin && npm run build && npx wrangler pages deploy .next --project-name=fukuoka-asobi-admin"
  }
}
```

実行：

```bash
npm run deploy:frontend
npm run deploy:admin
```

## 🔧 現在のエラーの修正方法

### 手順 1: Cloudflare Pages Dashboard で設定を確認

1. Cloudflare Dashboard にログイン
2. **Workers & Pages** セクションに移動
3. 該当プロジェクトを選択
4. **Settings** → **Builds & deployments** に移動

### 手順 2: Build 設定を修正

**誤った設定（現在）**:
```yaml
Build command: npm run build
Deploy command: npx wrangler versions upload  ❌ これが原因
```

**正しい設定**:
```yaml
Build command: npm install && cd frontend && npm run build
Build output directory: frontend/.next
Deploy command: (空欄または削除) ✅ デプロイコマンドは不要
```

### 手順 3: 再デプロイ

1. 設定を保存
2. **Deployments** タブに移動
3. **Retry deployment** をクリック

## 📝 wrangler.toml の役割

作成した `wrangler.toml` ファイルは、Wrangler CLI でローカルからデプロイする際に使用されます。

### frontend/wrangler.toml

```toml
name = "fukuoka-asobi-frontend"
compatibility_date = "2025-12-14"
pages_build_output_dir = ".next"

[vars]
NODE_VERSION = "20.11.0"
```

### admin/wrangler.toml

```toml
name = "fukuoka-asobi-admin"
compatibility_date = "2025-12-14"
pages_build_output_dir = ".next"

[vars]
NODE_VERSION = "20.11.0"
```

### wrangler.toml の使用例

```bash
# frontend ディレクトリで実行
cd frontend
npx wrangler pages deploy .next

# wrangler.toml の設定が自動的に読み込まれます
```

## 🚀 推奨デプロイフロー

### 本番環境（推奨）

**GitHub 連携で自動デプロイ**

```
1. コードを GitHub にプッシュ
   ↓
2. Cloudflare Pages が自動ビルド
   ↓
3. 自動デプロイ
```

**メリット**:
- 自動化されている
- ビルドログが残る
- ロールバックが簡単
- Preview デプロイが自動生成される

### 開発・テスト環境

**Wrangler CLI で直接デプロイ**

```bash
# Frontend
npm run build:frontend
cd frontend && npx wrangler pages deploy .next

# Admin
npm run build:admin
cd admin && npx wrangler pages deploy .next
```

**メリット**:
- 迅速なテスト
- GitHub にプッシュせずにデプロイ可能

## 📊 エラー修正の確認

### 修正前のビルドログ

```
✘ [ERROR] Missing entry-point to Worker script or to assets directory
Failed: error occurred while running deploy command
```

### 修正後のビルドログ（期待される出力）

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (16/16)
✓ Finalizing page optimization
✓ Collecting build traces

Success: Build command completed
Success: Deploying to Cloudflare Pages
Success: Deployment complete
```

## 🔗 参考リンク

- [Cloudflare Pages - Deploy a Next.js site](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Wrangler Pages Commands](https://developers.cloudflare.com/workers/wrangler/commands/#pages)
- [npm Workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces)

## 📌 まとめ

### やるべきこと

1. ✅ `wrangler.toml` ファイルを作成（完了）
2. ⚠️ **Cloudflare Pages Dashboard でデプロイコマンドを削除**
3. ⚠️ **Build command を `npm install && cd frontend && npm run build` に変更**
4. ⚠️ **Build output directory を `frontend/.next` に設定**

### やってはいけないこと

- ❌ `npx wrangler versions upload` を使用しない（これは Workers 用）
- ❌ Deploy command を設定しない（Cloudflare Pages は自動デプロイ）
- ❌ Build output directory を間違えない（`frontend/.next` または `admin/.next`）

---

**作成日**: 2025-12-14
**問題**: Cloudflare Pages デプロイエラー
**解決策**: デプロイコマンドの削除とビルド設定の修正
