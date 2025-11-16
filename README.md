# 福岡遊び日記 (Fukuoka Asobi)

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

「福岡遊び日記」は、福岡の遊び場所を探すためのWebアプリケーションです。一般的な観光地ではなく、「地元住民しか知らない」「通」「一歩背伸び」「価値観に触れる」をコンセプトに、ローカルな情報を提供します。ユーザーは行く日程・相手・天気などから、お店やプランを自動で提案してもらうことができます。

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

#### 開発環境
- **コンテナ化**: Docker Compose
- **データベース**: MySQL 8.0
- **ストレージ**: MinIO（S3互換）

#### 本番環境
- **バックエンド**: Fly.io
- **フロントエンド**: Vercel
- **データベース**: TiDB Cloud (Serverless)
- **ストレージ**: Cloudflare R2
- **コスト**: 無料枠内で運用可能（月額 0円〜）

## 📦 プロジェクト構成とライブラリ管理

このプロジェクトは **npm workspaces** を使用したモノレポ構造を採用しています。

### ワークスペース構成

```
fukuoka-asobi/
├── package.json          # ルートパッケージ（ワークスペース設定）
├── package-lock.json     # 統一されたロックファイル
├── node_modules/         # 共有依存関係
├── frontend/             # フロントエンド（ユーザー向け）
│   └── package.json
├── admin/                # 管理画面
│   └── package.json
└── backend/              # バックエンド（Rails）
```

### 共通ライブラリ（ルートレベル）

以下のライブラリはルートレベルで管理され、全ワークスペースで共有されます：

- **React** 19.x
- **Next.js** 15.3.x
- **Apollo Client** 3.13.x
- **GraphQL** 16.x
- **TypeScript** 5.x
- **ESLint** 9.x
- **GraphQL Code Generator** - スキーマ駆動開発のための型自動生成

### 開発コマンド

```bash
# 依存関係のインストール（初回またはpackage.json更新時）
npm install

# フロントエンド開発サーバー起動（ポート: 8200）
npm run dev:frontend

# 管理画面開発サーバー起動（ポート: 9200）
npm run dev:admin

# GraphQL型定義の生成（スキーマ変更時に実行）
cd frontend && npm run generate
cd admin && npm run generate

# ビルド
npm run build:frontend
npm run build:admin

# リント
npm run lint:frontend
npm run lint:admin

# 特定のワークスペースでコマンド実行
npm run <script> -w frontend
npm run <script> -w admin
```

### GraphQLスキーマ駆動開発

このプロジェクトでは、GraphQL Code Generatorを使用してバックエンドのスキーマから自動的にTypeScript型定義を生成しています。

- 📝 **詳細な運用ガイド**: [docs/GRAPHQL_CODEGEN.md](./docs/GRAPHQL_CODEGEN.md)
- 🎯 **型安全性**: バックエンドのスキーマ変更が即座にフロントエンドに反映
- ✨ **生成場所**: `frontend/src/__generated__/`, `admin/src/__generated__/`
- 🔄 **ワークフロー**: スキーマ変更 → `npm run generate` → 型定義更新

**重要**: GraphQLスキーマを変更した際は、必ず型定義を再生成してください。

### メリット

- ✅ **バージョンの統一**: 共通ライブラリのバージョンが一元管理され、不整合がない
- ✅ **ディスク容量の削減**: 重複する依存関係がない
- ✅ **メンテナンス性の向上**: 依存関係の更新が1箇所で完結
- ✅ **開発効率の向上**: パッケージ間の連携がスムーズ

## 🚀 デプロイ

### クイックスタート

本番環境へのデプロイは以下の手順で行います：

1. **デプロイ前の準備**
   - [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)を確認
   - 各サービスのアカウントを作成

2. **デプロイ実行**
   - [docs/deployment_guide.md](./docs/deployment_guide.md)の詳細な手順に従う

3. **主要サービス**
   - **TiDB Cloud**: MySQL互換のServerlessデータベース（無料枠: 5GB）
   - **Cloudflare R2**: S3互換のストレージ（無料枠: 10GB）
   - **Fly.io**: Railsアプリケーションホスティング（無料枠: 3台のVM）
   - **Vercel**: Next.jsフロントエンドホスティング（Hobbyプラン無料）

### コスト見積もり

- **無料枠内**: 月額 **0円**
- **小規模運用**: 月額 **1,000円程度**
- **中規模運用**: 月額 **3,000〜5,000円程度**

詳細は[デプロイガイド](./docs/deployment_guide.md)を参照してください。

---

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

## プロジェクト構成

```
fukuoka-asobi/
├── .github/                # GitHub関連ファイル（現在は未実装）
├── backend/                # Railsバックエンド
│   ├── app/                # アプリケーションコード
│   │   ├── controllers/    # コントローラー
│   │   │   ├── api/        # API用コントローラー
│   │   │   │   ├── passwords_controller.rb  # パスワードリセット
│   │   │   │   └── v1/     # APIバージョン1
│   │   │   │       ├── auth_controller.rb   # 認証
│   │   │   │       ├── sessions_controller.rb  # セッション管理
│   │   │   │       └── users_controller.rb  # ユーザー管理
│   │   │   ├── application_controller.rb    # アプリケーション共通コントローラー
│   │   │   ├── graphql_controller.rb        # GraphQL用コントローラー
│   │   │   └── concerns/   # 共通関心事
│   │   │       └── authentication.rb        # 認証関連の共通処理
│   │   ├── graphql/        # GraphQL関連
│   │   │   ├── backend_schema.rb            # GraphQLスキーマ定義
│   │   │   ├── mutations/  # ミューテーション（データ更新操作）
│   │   │   │   ├── add_favorite.rb          # お気に入り追加
│   │   │   │   ├── base_mutation.rb         # 基底ミューテーション
│   │   │   │   ├── create_bookmark.rb       # ブックマーク作成
│   │   │   │   ├── create_play_plan.rb      # 遊びプラン作成
│   │   │   │   ├── delete_bookmark.rb       # ブックマーク削除
│   │   │   │   ├── generate_plan.rb         # プラン生成
│   │   │   │   ├── remove_favorite.rb       # お気に入り削除
│   │   │   │   ├── update_bookmark.rb       # ブックマーク更新
│   │   │   │   ├── update_play_plan.rb      # 遊びプラン更新
│   │   │   │   ├── update_user_profile.rb   # ユーザープロフィール更新
│   │   │   │   ├── user_apple_auth.rb       # Apple認証
│   │   │   │   ├── user_google_auth.rb      # Google認証
│   │   │   │   ├── user_login.rb            # ログイン
│   │   │   │   ├── user_logout.rb           # ログアウト
│   │   │   │   └── user_register.rb         # ユーザー登録
│   │   │   ├── resolvers/  # リゾルバー（データ取得操作）
│   │   │   │   ├── base_resolver.rb         # 基底リゾルバー
│   │   │   │   ├── category_options_resolver.rb  # カテゴリーオプション
│   │   │   │   ├── current_user_resolver.rb      # 現在のユーザー
│   │   │   │   ├── event_resolver.rb             # イベント
│   │   │   │   ├── events_resolver.rb            # イベント一覧
│   │   │   │   ├── generate_plan_resolver.rb     # プラン生成
│   │   │   │   ├── is_favorite_resolver.rb       # お気に入り確認
│   │   │   │   ├── news_detail_resolver.rb       # ニュース詳細
│   │   │   │   ├── news_resolver.rb              # ニュース
│   │   │   │   ├── play_plan_resolver.rb         # 遊びプラン
│   │   │   │   ├── play_plans_resolver.rb        # 遊びプラン一覧
│   │   │   │   ├── search_plans_resolver.rb      # プラン検索
│   │   │   │   ├── theme_options_resolver.rb     # テーマオプション
│   │   │   │   ├── transportation_options_resolver.rb  # 交通手段オプション
│   │   │   │   ├── user_bookmarks_resolver.rb    # ユーザーブックマーク
│   │   │   │   ├── user_favorites_resolver.rb    # ユーザーお気に入り
│   │   │   │   └── user_play_plans_resolver.rb   # ユーザー遊びプラン
│   │   │   └── types/      # 型定義
│   │   │       ├── area_type.rb                  # エリア型
│   │   │       ├── base_*.rb                     # 基底型定義
│   │   │       ├── bookmark_type.rb              # ブックマーク型
│   │   │       ├── bookmarkable_union.rb         # ブックマーク可能型ユニオン
│   │   │       ├── category_type.rb              # カテゴリー型
│   │   │       ├── district_type.rb              # 地区型
│   │   │       ├── event_type.rb                 # イベント型
│   │   │       ├── favorite_type.rb              # お気に入り型
│   │   │       ├── hashtag_type.rb               # ハッシュタグ型
│   │   │       ├── mutation_type.rb              # ミューテーション型
│   │   │       ├── news_type.rb                  # ニュース型
│   │   │       ├── opening_hour_type.rb          # 営業時間型
│   │   │       ├── plan_detail_type.rb           # プラン詳細型
│   │   │       ├── play_plan_type.rb             # 遊びプラン型
│   │   │       ├── query_type.rb                 # クエリ型
│   │   │       ├── spot_type.rb                  # スポット型
│   │   │       ├── travel_detail_type.rb         # 移動詳細型
│   │   │       └── user_type.rb                  # ユーザー型
│   │   ├── models/         # モデル
│   │   │   ├── application_record.rb             # アプリケーション共通レコード
│   │   │   ├── area.rb                           # エリアモデル
│   │   │   ├── bookmark.rb                       # ブックマークモデル
│   │   │   ├── category.rb                       # カテゴリーモデル
│   │   │   ├── district.rb                       # 地区モデル
│   │   │   ├── event.rb                          # イベントモデル
│   │   │   ├── event_category.rb                 # イベントカテゴリーモデル
│   │   │   ├── favorite.rb                       # お気に入りモデル
│   │   │   ├── hashtag.rb                        # ハッシュタグモデル
│   │   │   ├── instagram_embed.rb                # インスタグラム埋め込みモデル
│   │   │   ├── menu.rb                           # メニューモデル
│   │   │   ├── news.rb                           # ニュースモデル
│   │   │   ├── opening_hour.rb                   # 営業時間モデル
│   │   │   ├── plan_detail.rb                    # プラン詳細モデル
│   │   │   ├── play_plan.rb                      # 遊びプランモデル
│   │   │   ├── play_plan_recommended_for.rb      # 遊びプランおすすめ対象モデル
│   │   │   ├── purpose.rb                        # 目的モデル
│   │   │   ├── recommended_for.rb                # おすすめ対象モデル
│   │   │   ├── spot.rb                           # スポットモデル
│   │   │   ├── spot_ambiance.rb                  # スポット雰囲気モデル
│   │   │   ├── spot_ambiance_relation.rb         # スポット雰囲気関連モデル
│   │   │   ├── spot_area.rb                      # スポットエリアモデル
│   │   │   ├── spot_category.rb                  # スポットカテゴリーモデル
│   │   │   ├── spot_hashtag.rb                   # スポットハッシュタグモデル
│   │   │   ├── spot_instagram_embed.rb           # スポットインスタグラム埋め込みモデル
│   │   │   ├── spot_menu.rb                      # スポットメニューモデル
│   │   │   ├── spot_purpose.rb                   # スポット目的モデル
│   │   │   ├── travel_detail.rb                  # 移動詳細モデル
│   │   │   └── user.rb                           # ユーザーモデル
│   │   ├── services/       # サービスクラス
│   │   │   ├── plan_generator.rb                 # プラン生成サービス
│   │   │   └── favorites/  # お気に入り関連サービス
│   │   │       └── toggle_service.rb             # お気に入り切り替えサービス
│   │   ├── mailers/        # メーラー
│   │   │   ├── application_mailer.rb             # アプリケーション共通メーラー
│   │   │   └── password_mailer.rb                # パスワードリセットメーラー
│   │   └── views/          # ビュー
│   ├── config/             # 設定ファイル
│   │   ├── application.rb                        # アプリケーション設定
│   │   ├── boot.rb                               # 起動設定
│   │   ├── database.yml                          # データベース設定
│   │   ├── routes.rb                             # ルーティング設定
│   │   ├── environments/                         # 環境別設定
│   │   └── initializers/                         # 初期化設定
│   ├── db/                 # データベース関連
│   │   ├── migrate/        # マイグレーションファイル
│   │   │   ├── 20250302004218_create_categories.rb            # カテゴリーテーブル作成
│   │   │   ├── 20250307174617_create_districts.rb             # 地区テーブル作成
│   │   │   ├── 20250307174627_create_areas.rb                 # エリアテーブル作成
│   │   │   ├── 20250307174635_create_stores.rb                # 店舗テーブル作成
│   │   │   ├── 20250307174641_create_opening_hours.rb         # 営業時間テーブル作成
│   │   │   ├── 20250315113843_create_users.rb                 # ユーザーテーブル作成
│   │   │   ├── 20250315231537_rename_store_to_spot_and_add_spot_type.rb  # 店舗→スポットリネーム
│   │   │   ├── 20250316145732_create_event_categories.rb      # イベントカテゴリーテーブル作成
│   │   │   ├── 20250316145752_create_events.rb                # イベントテーブル作成
│   │   │   ├── 20250317144322_create_news.rb                  # ニューステーブル作成
│   │   │   ├── 20250320063105_add_planner_fields_to_play_plans.rb  # プランナーフィールド追加
│   │   │   ├── 20250322055500_create_travel_details.rb        # 移動詳細テーブル作成
│   │   │   ├── 20250413052618_create_bookmarks.rb             # ブックマークテーブル作成
│   │   │   └── 20250417083400_create_favorites.rb             # お気に入りテーブル作成
│   │   ├── schema.rb                                          # スキーマ定義
│   │   └── seeds.rb                                           # 初期データ
│   ├── lib/                # ライブラリ
│   │   └── tasks/          # Rakeタスク
│   ├── spec/               # テスト
│   │   ├── factories/      # ファクトリー
│   │   ├── fixtures/       # フィクスチャ
│   │   ├── graphql/        # GraphQLテスト
│   │   ├── models/         # モデルテスト
│   │   └── services/       # サービステスト
│   ├── Gemfile             # Gem依存関係
│   └── Gemfile.lock        # Gemバージョンロック
├── docs/                   # ドキュメント
│   ├── design.md                                 # 全体設計書
│   ├── cookie_auth_design.md                     # Cookie認証設計
│   ├── generate_plan_auth_design.md              # プラン生成認証設計
│   ├── news_design.md                            # ニュース機能設計
│   ├── password_reset_design.md                  # パスワードリセット設計
│   ├── plan_detail_auth_design.md                # プラン詳細認証設計
│   ├── plan_generator_design.md                  # プラン生成機能設計
│   ├── plan_search_design.md                     # プラン検索機能設計
│   └── user_profile_update_design.md             # ユーザープロフィール更新設計
├── frontend/               # Next.jsフロントエンド
│   ├── public/             # 静的ファイル
│   │   ├── logo.png                              # ロゴ
│   │   ├── logo_inversion.png                    # 反転ロゴ
│   │   ├── kv.jpg                                # キービジュアル
│   │   ├── fukuoka_map.svg                       # 福岡マップ
│   │   └── styles/                               # スタイルシート
│   ├── src/                # ソースコード
│   │   ├── app/            # Next.js App Router
│   │   │   ├── layout.tsx                        # レイアウト
│   │   │   ├── page.tsx                          # トップページ
│   │   │   ├── about/                            # 会社概要ページ
│   │   │   ├── advertising/                      # 広告ページ
│   │   │   ├── contact/                          # お問い合わせページ
│   │   │   ├── events/                           # イベントページ
│   │   │   │   └── [id]/                         # イベント詳細ページ
│   │   │   ├── faq/                              # FAQページ
│   │   │   ├── forgot-password/                  # パスワード忘れページ
│   │   │   ├── login/                            # ログインページ
│   │   │   ├── mypage/                           # マイページ
│   │   │   ├── news/                             # ニュースページ
│   │   │   │   └── [id]/                         # ニュース詳細ページ
│   │   │   ├── plans/                            # プランページ
│   │   │   │   └── [id]/                         # プラン詳細ページ
│   │   │   ├── privacy-policy/                   # プライバシーポリシーページ
│   │   │   ├── register/                         # 登録ページ
│   │   │   ├── reset-password/                   # パスワードリセットページ
│   │   │   ├── search/                           # 検索ページ
│   │   │   ├── sitemap/                          # サイトマップページ
│   │   │   └── spots/                            # スポットページ
│   │   │       └── [id]/                         # スポット詳細ページ
│   │   ├── components/     # コンポーネント
│   │   │   ├── ApolloWrapper.tsx                 # Apolloラッパー
│   │   │   ├── BusinessHours.tsx                 # 営業時間
│   │   │   ├── Categories.tsx                    # カテゴリー
│   │   │   ├── EventDetail.tsx                   # イベント詳細
│   │   │   ├── EventList.tsx                     # イベント一覧
│   │   │   ├── Footer.tsx                        # フッター
│   │   │   ├── Header.tsx                        # ヘッダー
│   │   │   ├── NewsCard.tsx                      # ニュースカード
│   │   │   ├── PlanTimeline.tsx                  # プランタイムライン
│   │   │   ├── PlayPlanDetail.tsx                # 遊びプラン詳細
│   │   │   ├── PlayPlanList.tsx                  # 遊びプラン一覧
│   │   │   ├── SpotCard.tsx                      # スポットカード
│   │   │   ├── SpotList.tsx                      # スポット一覧
│   │   │   ├── adapters/                         # アダプター
│   │   │   │   ├── EventDetailAdapter.tsx        # イベント詳細アダプター
│   │   │   │   ├── NewsDetailAdapter.tsx         # ニュース詳細アダプター
│   │   │   │   └── SpotDetailAdapter.tsx         # スポット詳細アダプター
│   │   │   ├── auth/                             # 認証関連
│   │   │   │   ├── ForgotPassword.tsx            # パスワード忘れ
│   │   │   │   ├── Login.tsx                     # ログイン
│   │   │   │   ├── RegisterFlow.tsx              # 登録フロー
│   │   │   │   └── ResetPassword.tsx             # パスワードリセット
│   │   │   ├── common/                           # 共通コンポーネント
│   │   │   │   ├── AreaMap.tsx                   # エリアマップ
│   │   │   │   ├── Button.tsx                    # ボタン
│   │   │   │   ├── DatePicker.tsx                # 日付選択
│   │   │   │   ├── FavoriteButton.tsx            # お気に入りボタン
│   │   │   │   ├── Loading.tsx                   # ローディング
│   │   │   │   └── TabSelector.tsx               # タブ選択
│   │   │   ├── mypage/                           # マイページ関連
│   │   │   │   ├── MyPageTabs.tsx                # マイページタブ
│   │   │   │   ├── ProfileEditor.tsx             # プロフィール編集
│   │   │   │   └── UserBookmarks.tsx             # ユーザーブックマーク
│   │   │   ├── plan/                             # プラン関連
│   │   │   │   ├── PlanHeader.tsx                # プランヘッダー
│   │   │   │   ├── PlanRecommendation.tsx        # プラン推薦
│   │   │   │   └── PlanStepList.tsx              # プランステップリスト
│   │   │   ├── search/                           # 検索関連
│   │   │   │   ├── AreaSelector.tsx              # エリア選択
│   │   │   │   ├── DateTimeSelector.tsx          # 日時選択
│   │   │   │   └── SearchContainer.tsx           # 検索コンテナ
│   │   │   └── tests/                            # テスト
│   │   │       └── Login.test.tsx                # ログインテスト
│   │   ├── graphql/        # GraphQLクエリ・ミューテーション
│   │   │   ├── bookmarks.graphql                 # ブックマーククエリ
│   │   │   ├── favorites.graphql                 # お気に入りクエリ
│   │   │   ├── generatePlan.graphql              # プラン生成クエリ
│   │   │   ├── getRecommendedEvents.graphql      # おすすめイベント取得
│   │   │   ├── getRecommendedSpots.graphql       # おすすめスポット取得
│   │   │   ├── mypage.graphql                    # マイページクエリ
│   │   │   ├── news.graphql                      # ニュースクエリ
│   │   │   ├── searchPlans.graphql               # プラン検索クエリ
│   │   │   └── queries/                          # クエリ
│   │   │       ├── getAreas.ts                   # エリア取得
│   │   │       ├── getCategories.ts              # カテゴリー取得
│   │   │       ├── getEvent.ts                   # イベント取得
│   │   │       ├── getNews.ts                    # ニュース取得
│   │   │       └── getSpot.ts                    # スポット取得
│   │   ├── lib/            # ユーティリティ関数
│   │   │   ├── apolloClient.ts                   # Apolloクライアント
│   │   │   ├── dateUtils.ts                      # 日付ユーティリティ
│   │   │   ├── api/                              # API関連
│   │   │   │   ├── client.ts                     # APIクライアント
│   │   │   │   └── passwordApi.ts                # パスワードAPI
│   │   │   ├── auth/                             # 認証関連
│   │   │   │   └── AuthContext.tsx               # 認証コンテキスト
│   │   │   └── hooks/                            # カスタムフック
│   │   │       └── useOptions.ts                 # オプションフック
│   │   ├── styles/         # スタイル
│   │   │   ├── Button.module.css                 # ボタンスタイル
│   │   │   ├── DatePicker.module.css             # 日付選択スタイル
│   │   │   ├── PlanTimeline.module.css           # プランタイムラインスタイル
│   │   │   └── SearchForm.module.css             # 検索フォームスタイル
│   │   ├── types/          # 型定義
│   │   │   ├── event.ts                          # イベント型
│   │   │   ├── news.ts                           # ニュース型
│   │   │   ├── plan.ts                           # プラン型
│   │   │   └── spot.ts                           # スポット型
│   │   └── utils/          # ユーティリティ
│   │       ├── authUtils.ts                      # 認証ユーティリティ
│   │       └── dateUtils.ts                      # 日付ユーティリティ
│   ├── package.json        # パッケージ設定
│   └── tsconfig.json       # TypeScript設定
└── schemaspy/              # SchemaSpy関連
    ├── config/             # SchemaSpy設定ファイル
    │   └── schemaspy.properties                  # SchemaSpy設定
    ├── output/             # 生成されたER図などの出力
    │   ├── index.html                            # メインインデックス
    │   ├── diagrams/                             # 図表
    │   │   ├── summary/                          # 概要図
    │   │   │   ├── relationships.real.compact.svg  # 実際のリレーション（コンパクト）
    │   │   │   └── relationships.real.large.svg    # 実際のリレーション（大）
    │   │   └── tables/                           # テーブル図
    │   └── tables/                               # テーブル情報
    └── run-schemaspy.sh    # 実行スクリプト
```

## 主要コンポーネント

### バックエンド (Rails)

- **コントローラー**: API・GraphQLエンドポイントを提供
- **モデル**: データベースとのインタラクションを管理
- **GraphQL**: フロントエンドとのデータやり取りを担当
- **サービス**: ビジネスロジックを実装

### フロントエンド (Next.js)

- **App Router**: ページルーティングを管理
- **コンポーネント**: UI要素を構築
- **GraphQL**: バックエンドとのデータやり取りを担当
- **ユーティリティ**: 共通機能を提供

### データベース

- **マイグレーション**: データベーススキーマを定義・更新
- **SchemaSpy**: データベース構造を可視化
## 👥 貢献ガイドライン

### コーディング規約

- バックエンド: [RuboCop](https://github.com/rubocop/rubocop)の規約に従う
- フロントエンド: [ESLint](https://eslint.org/)と[Prettier](https://prettier.io/)の規約に従う

### テスト

- バックエンド: RSpecを使用したテスト
- フロントエンド: Vitestを使用したテスト

### コマンド
- コンテナへのアタッチ
   ```shell
   docker exec -it fukuoka_asobi_backend bash
   ```
- 開発環境のクレデンシャルファイルの更新
   ```shell
   EDITOR="vim -f" bin/rails credentials:edit --environment development
   ```
- 本番環境のクレデンシャルファイルの更新
   ```shell
   EDITOR="vim -f" bin/rails credentials:edit --environment production
   ```

### ドキュメント

- 設計書: 各機能の詳細設計を記述
