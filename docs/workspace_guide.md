# npm Workspaces ガイド

このドキュメントでは、福岡遊び日記プロジェクトで採用している npm workspaces によるモノレポ構成について説明します。

## 概要

npm workspaces を使用することで、複数のパッケージ（frontend, admin）を単一のリポジトリで効率的に管理できます。

## ワークスペース構成

```
fukuoka-asobi/
├── package.json              # ルートパッケージ（ワークスペース定義）
├── package-lock.json         # プロジェクト全体の依存関係ロックファイル
├── node_modules/             # 共有依存関係
│   ├── react/               # 全ワークスペースで共有
│   ├── next/
│   ├── @apollo/client/
│   └── ...
├── frontend/                 # フロントエンドワークスペース
│   ├── package.json         # frontend固有の依存関係
│   ├── src/
│   └── ...
└── admin/                    # 管理画面ワークスペース
    ├── package.json         # admin固有の依存関係
    ├── src/
    └── ...
```

## 依存関係の管理方針

### ルートレベル（共通依存関係）

以下の依存関係はルートレベルで管理され、全ワークスペースで共有されます：

**本番依存関係:**
- `react` - UIライブラリ
- `react-dom` - React DOMレンダラー
- `next` - Next.jsフレームワーク
- `@apollo/client` - GraphQLクライアント
- `graphql` - GraphQLコアライブラリ

**開発依存関係:**
- `typescript` - TypeScript言語
- `eslint` - リンター
- `eslint-config-next` - Next.js ESLint設定
- `@types/*` - 型定義（node, react, react-dom）
- `@graphql-codegen/*` - GraphQLコード生成ツール
- `commitizen`, `cz-git` - コミットメッセージ支援

### ワークスペースレベル（個別依存関係）

各ワークスペースは、そのワークスペース固有の依存関係のみを `package.json` に記述します。

**frontend:**
- `axios` - HTTPクライアント
- `date-fns` - 日付操作
- `react-slick`, `swiper` - カルーセル
- `slick-carousel` - スライダー

**admin:**
- `@radix-ui/*` - UIコンポーネント
- `react-hook-form` - フォーム管理
- `zod` - バリデーション
- `@hello-pangea/dnd` - ドラッグ&ドロップ
- `lucide-react` - アイコン

## 基本的な操作

### 依存関係のインストール

プロジェクトルートで実行：

```bash
# 全ワークスペースの依存関係をインストール
npm install
```

このコマンドは：
1. ルートレベルの依存関係をインストール
2. 各ワークスペースの依存関係をインストール
3. 可能な限り依存関係を巻き上げて共有

### 依存関係の追加

#### 共通ライブラリを追加する場合

全ワークスペースで使用するライブラリは、ルートに追加します：

```bash
# ルートに本番依存関係を追加
npm install <package-name>

# ルートに開発依存関係を追加
npm install -D <package-name>
```

#### ワークスペース固有のライブラリを追加する場合

特定のワークスペースでのみ使用するライブラリは、そのワークスペースに追加します：

```bash
# frontendに追加
npm install <package-name> -w frontend

# adminに追加
npm install <package-name> -w admin

# 開発依存関係として追加
npm install -D <package-name> -w frontend
```

### 依存関係の更新

```bash
# 全依存関係を最新の許可されるバージョンに更新
npm update

# 特定のパッケージを更新
npm update <package-name>

# 特定のワークスペースで更新
npm update -w frontend
```

### 依存関係の削除

```bash
# ルートから削除
npm uninstall <package-name>

# 特定のワークスペースから削除
npm uninstall <package-name> -w frontend
```

## ワークスペースでのスクリプト実行

### ルートレベルで定義されたスクリプト

便利なショートカットがルートの `package.json` に定義されています：

```bash
# フロントエンド開発サーバー起動
npm run dev:frontend

# 管理画面開発サーバー起動
npm run dev:admin

# ビルド
npm run build:frontend
npm run build:admin

# リント
npm run lint:frontend
npm run lint:admin
```

### 直接ワークスペースのスクリプトを実行

```bash
# -w オプションでワークスペースを指定
npm run <script-name> -w <workspace-name>

# 例
npm run dev -w frontend
npm run build -w admin
npm run generate -w frontend  # GraphQL型生成
```

### 全ワークスペースで実行

```bash
# 全ワークスペースで同じスクリプトを実行
npm run <script-name> --workspaces

# 例：全ワークスペースでビルド
npm run build --workspaces
```

## 依存関係の確認

### ワークスペース一覧を表示

```bash
npm list --workspaces --depth=0
```

### 特定のパッケージがどこにインストールされているか確認

```bash
# 全体で確認
npm list <package-name>

# 特定のワークスペースで確認
npm list <package-name> -w frontend
```

### インストールされている依存関係のツリー表示

```bash
# シンプルな表示
npm list --depth=1

# 特定のワークスペース
npm list -w frontend --depth=1
```

## トラブルシューティング

### node_modules が壊れた場合

```bash
# node_modulesとlock fileを削除
rm -rf node_modules package-lock.json frontend/node_modules admin/node_modules

# 再インストール
npm install
```

### ワークスペース間の依存関係がおかしい場合

```bash
# キャッシュをクリア
npm cache clean --force

# 再インストール
rm -rf node_modules package-lock.json
npm install
```

### バージョンの不整合が発生した場合

ルートとワークスペースで異なるバージョンが指定されている場合、npm は適切に解決しますが、意図しない動作になることがあります。

1. `package.json` を確認して、バージョン範囲が適切か確認
2. `npm list <package-name>` でインストールされているバージョンを確認
3. 必要に応じてバージョン指定を調整

## ベストプラクティス

### 1. 共通ライブラリはルートに配置

複数のワークスペースで使用するライブラリは、ルートレベルで管理しましょう。

- メリット：バージョン統一、ディスク容量削減
- 対象：React, Next.js, TypeScript, ESLint など

### 2. ワークスペース固有のライブラリは個別に配置

特定のワークスペースでのみ使用するライブラリは、そのワークスペースで管理しましょう。

- メリット：責任範囲の明確化、不要な依存関係の増加防止
- 例：admin の UI ライブラリ、frontend の特殊なライブラリ

### 3. バージョンは可能な限り統一

同じライブラリの異なるバージョンを複数インストールするのは避けましょう。

- package.json で `^` や `~` を使用してバージョン範囲を指定
- 定期的に `npm update` を実行

### 4. package-lock.json は必ずコミット

ルートの `package-lock.json` は必ずリポジトリにコミットしてください。

- 全開発者で同じバージョンを使用できる
- CI/CD で同じビルドが再現できる

### 5. 個別の lock file は削除

`frontend/package-lock.json` や `admin/package-lock.json` は削除し、`.gitignore` に追加してください。

## よくある質問

### Q: なぜ admin/node_modules に postcss があるのか？

A: postcss は peer dependency として個別インストールが必要な場合があります。これは正常な動作です。

### Q: ワークスペース間で異なるバージョンを使いたい場合は？

A: ワークスペースの `package.json` で明示的にバージョンを指定してください。npm は適切に解決します。

ただし、可能な限りバージョンを統一することを推奨します。

### Q: CI/CD での設定は変わりますか？

A: 基本的には変わりません。ルートで `npm install` を実行すれば、全ワークスペースの依存関係がインストールされます。

ビルドコマンドは `npm run build -w frontend` のように指定します。

## 参考リンク

- [npm workspaces 公式ドキュメント](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [npm CLI コマンドリファレンス](https://docs.npmjs.com/cli/v10/commands)
