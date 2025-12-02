# Vercel デプロイ問題の解決方法

## 問題の概要

2024年12月、`frontend` と `admin` の Vercel デプロイが突然失敗するようになった。

### エラーメッセージ

**エラー 1: Next.js バージョン検出の失敗**
```
Warning: Could not identify Next.js version, ensure it is defined as a project dependency.
Error: No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies".
```

**エラー 2: GraphQL CodeGen の型解決の失敗**
```
Type error: Cannot find module '@graphql-codegen/cli' or its corresponding type declarations.
> 1 | import { CodegenConfig } from "@graphql-codegen/cli";
```

**エラー 3: Storybook の型解決の失敗**
```
Type error: Cannot find module '@storybook/react' or its corresponding type declarations.
> 1 | import type { Meta, StoryObj } from '@storybook/react';
```

## 根本原因

このプロジェクトは **npm workspaces** を使用したモノレポ構造になっています。

### 問題となっていた構成

```json
// ルート package.json
{
  "workspaces": ["frontend", "admin"],
  "dependencies": {
    "next": "15.3.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}

// frontend/package.json (修正前)
{
  "dependencies": {
    "@apollo/client": "*",  // ワイルドカード
    "graphql": "*",         // ワイルドカード
    // next, react, react-dom が明示的に定義されていない
  }
}
```

### なぜ Vercel で失敗したか

1. **npm workspaces のワイルドカード依存**
   - `"*"` はルートの `package.json` からバージョンを継承する npm workspaces の機能
   - ローカルや GitHub Actions では正しく動作

2. **Vercel の制限**
   - Vercel は Root Directory（`/frontend` や `/admin`）を個別にビルド
   - そのディレクトリの `package.json` のみを参照
   - ワイルドカード `"*"` を有効なバージョンとして認識できない
   - `next` が dependencies に明示的に定義されていないため検出失敗

## 解決方法

### 1. 明示的なバージョン指定

`frontend/package.json` と `admin/package.json` に、ルートと同じバージョンを明示的に追加：

```json
{
  "dependencies": {
    "@apollo/client": "^3.13.8",  // "*" から変更
    "graphql": "^16.11.0",         // "*" から変更
    "next": "15.3.1",               // 追加
    "react": "^19.0.0",             // 追加
    "react-dom": "^19.0.0"          // 追加
  },
  "devDependencies": {
    "@types/node": "^20",           // "*" から変更
    "@types/react": "^19",          // "*" から変更
    "@types/react-dom": "^19",      // "*" から変更
    "typescript": "^5.8.2",         // "*" から変更
    "eslint": "^9",                 // "*" から変更
    "eslint-config-next": "15.3.1"  // "*" から変更
  }
}
```

### 2. GraphQL CodeGen パッケージの追加

`codegen.ts` が `@graphql-codegen/cli` をインポートしているため、これらのパッケージを devDependencies に追加：

```json
{
  "devDependencies": {
    "@graphql-codegen/cli": "^5.0.5",
    "@graphql-codegen/client-preset": "^4.8.0",
    "@graphql-codegen/typescript": "^4.1.6",
    "@graphql-codegen/typescript-operations": "^4.6.0"
  }
}
```

### 3. Storybook ファイルの除外

`.stories.tsx` ファイルが `@storybook/react` をインポートしていますが、これらのファイルは本番ビルドに不要です。`tsconfig.json` で除外：

```json
{
  "exclude": ["node_modules", "**/*.stories.tsx"]
}
```

これにより、Next.js ビルド時に Storybook ファイルが処理されず、Storybook パッケージが不要になります。

### 4. vercel.json の追加（オプション）

各ディレクトリに `vercel.json` を追加して設定を固定化：

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install"
}
```

## Vercel での設定確認

各プロジェクトの設定を確認：

### Frontend プロジェクト
- **Root Directory**: `frontend` （必須）
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Node.js Version**: 20.x （推奨）

### Admin プロジェクト  
- **Root Directory**: `admin` （必須）
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Node.js Version**: 20.x （推奨）

## 今後の注意点

### バージョン更新時

ルートの `package.json` で依存関係を更新した場合、**必ず** `frontend/package.json` と `admin/package.json` も同じバージョンに更新してください。

```bash
# 例: Next.js を 15.3.1 → 15.4.0 に更新する場合

# 1. ルートを更新
npm install next@15.4.0

# 2. 手動で frontend/package.json と admin/package.json を編集
# "next": "15.3.1" → "next": "15.4.0"

# 3. 依存関係を再インストール
npm install
```

### ワークスペースの依存関係

以下のパッケージは必ず明示的なバージョンを指定：

**dependencies:**
- `next`
- `react`
- `react-dom`
- `@apollo/client`
- `graphql`

**devDependencies:**
- `@graphql-codegen/cli`
- `@graphql-codegen/client-preset`
- `@graphql-codegen/typescript`
- `@graphql-codegen/typescript-operations`
- `typescript`
- `eslint`
- `eslint-config-next`
- `@types/*` (TypeScript 型定義)

> **重要**: `codegen.ts` が `@graphql-codegen/cli` をインポートするため、GraphQL CodeGen パッケージは devDependencies に必須です。これがないと Vercel ビルド時に TypeScript が型を解決できずエラーになります。

## 検証方法

### ローカルビルド

```bash
# 依存関係のインストール
npm install

# Frontend ビルド
npm run build:frontend

# Admin ビルド
npm run build:admin

# Linting
npm run lint:frontend
npm run lint:admin
```

### Next.js バージョンの確認

```bash
# Frontend
cd frontend
npm list next

# Admin
cd admin
npm list next
```

両方とも明示的なバージョン（例: `15.3.1`）が表示されればOK。

## トラブルシューティング

### ビルドがまだ失敗する場合

1. **Root Directory の確認**
   - Vercel Dashboard → Settings → General
   - Root Directory が正しく設定されているか確認

2. **キャッシュのクリア**
   - Vercel Dashboard でデプロイをトリガー
   - "Redeploy" → "Clear cache and redeploy"

3. **依存関係の再インストール**
   ```bash
   rm -rf node_modules package-lock.json
   rm -rf frontend/node_modules admin/node_modules
   npm install
   ```

4. **package.json の検証**
   - `next` が dependencies に存在するか
   - バージョンが `"*"` ではなく明示的な番号か
   - ルートと同じバージョンか

## 参考リンク

- [Vercel Documentation: Monorepos](https://vercel.com/docs/concepts/monorepos)
- [npm Workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## 修正履歴

| 日付 | 内容 |
|------|------|
| 2024-12-02 | 初版作成（Issue #178 対応） |
