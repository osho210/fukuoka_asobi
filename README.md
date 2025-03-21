# 福岡遊び (Fukuoka Asobi)

福岡の遊び場所を探すためのWebアプリケーションです。ユーザーは様々なカテゴリー（カフェ、レストラン、アクティビティなど）から場所を探し、プランを作成・共有することができます。

## 📋 目次

- [概要](#概要)
- [機能](#機能)
- [システム構成](#システム構成)
- [セットアップ手順](#セットアップ手順)
- [開発ワークフロー](#開発ワークフロー)
- [ディレクトリ構造](#ディレクトリ構造)
- [API仕様](#api仕様)
- [貢献ガイドライン](#貢献ガイドライン)

## 📝 概要

「福岡遊び」は、福岡の遊び場所を探すためのWebアプリケーションです。一般的な観光地ではなく、「地元住民しか知らない」「通」「一歩背伸び」「価値観に触れる」をコンセプトに、ローカルな情報を提供します。ユーザーは行く日程・相手・天気などから、お店やプランを自動で提案してもらうことができます。

### ターゲットユーザー

- **20代前半〜後半の男性**: デートプランを探している社会人
- **20代後半〜30代前半の女性**: 休日に友達や一人で新しいスポットを巡りたい方

## ✨ 機能

### 現在実装済みの機能

- **カテゴリー一覧表示**: 様々なカテゴリーを閲覧できます
- **ユーザー認証システム**:
  - メールアドレスとパスワードによる登録・ログイン
  - Google認証によるログイン
  - Apple認証によるログイン
  - 3ステップの会員登録フロー
  - JWTを使用したセッション管理

### 今後実装予定の機能

- **カテゴリー別の場所一覧表示**
- **場所の詳細情報表示**
- **お気に入り登録機能**
- **レビュー投稿機能**
- **プラン作成・共有機能**
- **天候に応じたプラン提案機能**

## 🏗 システム構成

### フロントエンド

- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **状態管理**: Apollo Client
- **スタイリング**: CSS

### バックエンド

- **フレームワーク**: Ruby on Rails
- **API**: GraphQL
- **認証**: Devise + JWT
- **データベース**:
  - 開発環境: SQLite
  - 本番環境: PostgreSQL

### インフラ

- **開発環境**: Docker Compose
- **本番環境**: 未定

## 🚀 セットアップ手順

### 前提条件

- Docker と Docker Compose がインストールされていること
- Node.js と npm がインストールされていること
- Ruby がインストールされていること

### 開発環境のセットアップ

1. リポジトリをクローン

```bash
git clone <repository-url>
cd fukuoka-asobi
```

2. バックエンドのセットアップ

```bash
cd backend
bundle install
rails db:create
rails db:migrate
rails db:seed
```

3. フロントエンドのセットアップ

```bash
cd ../frontend
npm install
```

4. 開発サーバーの起動

バックエンド:
```bash
cd backend
rails server -p 3000
```

フロントエンド:
```bash
cd frontend
npm run dev
```

5. ブラウザでアクセス

フロントエンド: http://localhost:8200
バックエンドGraphQLエンドポイント: http://localhost:3000/graphql

## 💻 開発ワークフロー

### ブランチ戦略

- `main`: 本番環境用のブランチ
- `develop`: 開発用のブランチ
- `feature/*`: 機能追加用のブランチ
- `bugfix/*`: バグ修正用のブランチ

### コミットメッセージの規約

```
[タイプ]: 変更内容の要約

変更内容の詳細な説明
```

タイプ:
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響を与えない変更（空白、フォーマット、セミコロンの欠落など）
- `refactor`: バグを修正せず、機能を追加しないコード変更
- `test`: テストの追加または修正
- `chore`: ビルドプロセスやドキュメント生成などの変更

### Pull Requestのプロセス

1. 機能ブランチを作成し、変更を実装
2. テストを追加・更新し、すべてのテストが通ることを確認
3. Pull Requestを作成
4. コードレビューを受け、必要に応じて修正
5. レビュー承認後、ブランチをマージ

## 📁 ディレクトリ構造

```
fukuoka-asobi/
├── .github/                # GitHub関連ファイル
├── backend/                # Railsバックエンド
│   ├── app/                # アプリケーションコード
│   │   ├── controllers/    # コントローラー
│   │   ├── graphql/        # GraphQL関連
│   │   ├── models/         # モデル
│   │   └── ...
│   ├── config/             # 設定ファイル
│   ├── db/                 # データベース関連
│   └── ...
├── docs/                   # ドキュメント
│   └── design.md           # 設計ドキュメント
└── frontend/               # Next.jsフロントエンド
    ├── public/             # 静的ファイル
    ├── src/                # ソースコード
    │   ├── app/            # Next.js App Router
    │   ├── components/     # コンポーネント
    │   ├── graphql/        # GraphQLクエリ・ミューテーション
    │   └── lib/            # ユーティリティ関数
    └── ...
```

## 📡 API仕様

### GraphQL API

バックエンドはGraphQLを使用してAPIを提供しています。エンドポイントは `/graphql` です。

#### 主なクエリ

- `categories`: カテゴリー一覧を取得
- `spots`: スポット一覧を取得
- `spot(id: ID!)`: 特定のスポットを取得

#### 主なミューテーション

- `userRegister`: ユーザー登録
- `userLogin`: ログイン
- `userLogout`: ログアウト
- `userGoogleAuth`: Google認証
- `userAppleAuth`: Apple認証

### REST API

認証関連の一部機能はREST APIも提供しています。

- `POST /api/v1/login`: ログイン
- `POST /api/v1/signup`: 会員登録
- `DELETE /api/v1/logout`: ログアウト

### ルーティング設定

フロントエンドからバックエンドへのAPIリクエストは、Next.jsのリライト機能を使用して転送されます。

#### Next.jsのリライト設定

`next.config.ts`で以下のリライトルールが設定されています：

```typescript
async rewrites() {
  return [
    {
      source: '/api/v1/:path*',
      destination: 'http://localhost:3000/api/v1/:path*',
    },
    {
      source: '/graphql',
      destination: 'http://localhost:3000/graphql',
    },
  ];
}
```

#### Apollo Clientの設定

Apollo Clientは相対パスを使用してGraphQLエンドポイントにアクセスします：

```typescript
const client = new ApolloClient({
    link: new HttpLink({
        uri: '/graphql',
        credentials: 'include',
    }),
    cache: new InMemoryCache(),
});
```

これにより、リクエストはNext.jsのリライトルールを通じてバックエンドに転送されます。

## 👥 貢献ガイドライン

### コーディング規約

- バックエンド: [RuboCop](https://github.com/rubocop/rubocop)の規約に従う
- フロントエンド: [ESLint](https://eslint.org/)と[Prettier](https://prettier.io/)の規約に従う

### テスト

- バックエンド: RSpecを使用したテスト
- フロントエンド: Vitestを使用したテスト

### ドキュメント

- 新機能を追加する場合は、対応するドキュメントも更新する
- APIの変更がある場合は、API仕様書を更新する

### Issue・Pull Request

- 新機能の追加や大きな変更を行う前に、Issueを作成して議論する
- Pull Requestは小さく保ち、1つの機能や修正に焦点を当てる
- Pull Requestには適切なテストとドキュメントを含める

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。
