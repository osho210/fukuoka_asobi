# ニュース機能 設計書

## 要件定義書

### 概要
福岡遊び日記サービスにニュース機能を追加します。ニュースは管理者や編集部が投稿し、ユーザーに最新情報を提供するための機能です。

### 機能要件
1. ニュース記事の作成・編集・削除機能
2. ニュース記事の一覧表示機能
3. ニュース記事の詳細表示機能
4. ニュース記事のステータス管理（下書き/公開/アーカイブ）
5. カテゴリー別のニュース表示機能
6. 著者（ユーザー）との関連付け

### 非機能要件
1. レスポンシブデザイン対応
2. SEO対策
3. 画像の最適化

## 設計書

### 概略設計
ニュース機能は、バックエンドでRails、フロントエンドでNext.jsを使用して実装します。
データはGraphQLを通じてやり取りします。

### データベース設計

#### ニューステーブル (news)
| カラム名 | データ型 | 説明 |
|---------|---------|------|
| id | INT (PK, AUTO_INCREMENT) | ニュースの一意な ID |
| title | VARCHAR(255) | ニュースのタイトル |
| body | TEXT | ニュースの本文 |
| published_at | DATETIME | 公開日 (ニュースが公開される日時) |
| status | ENUM('draft', 'published', 'archived') | ステータス (下書き / 公開 / アーカイブ) |
| image_url | VARCHAR(255) (NULLABLE) | ニュースのサムネイル画像 (任意) |
| author_id | INT (FK, NULLABLE) | 投稿者の ID (ユーザーテーブルへの外部キー) |
| category_id | INT (FK, NULLABLE) | カテゴリーの ID (カテゴリーテーブルへの外部キー) |
| created_at | DATETIME | 作成日時 |
| updated_at | DATETIME | 更新日時 |

### 関連
- News belongs_to User (author)
- News belongs_to Category
- User has_many News
- Category has_many News

### 機能設計

#### バックエンド
1. Newsモデルの作成
2. GraphQLスキーマの更新
   - News型の定義
   - クエリの実装（一覧取得、詳細取得）
   - ミューテーションの実装（作成、更新、削除）
3. シードデータの作成

#### フロントエンド
1. ニュース一覧ページ
   - 最新のニュース記事を表示
   - カテゴリーによるフィルタリング
   - ページネーション
2. ニュース詳細ページ
   - 記事の詳細表示
   - 関連記事の表示
3. 共通コンポーネント
   - NewsCard: ニュース記事のカード表示
   - NewsList: ニュース記事のリスト表示

### クラス構成

#### バックエンド
- News (モデル)
- Types::NewsType (GraphQL型)
- Resolvers::NewsResolver (GraphQLリゾルバ)
- Mutations::CreateNews, UpdateNews, DeleteNews (GraphQLミューテーション)

#### フロントエンド
- NewsCard (コンポーネント)
- NewsList (コンポーネント)
- NewsDetail (コンポーネント)
- app/news/page.tsx (ニュース一覧ページ)
- app/news/[id]/page.tsx (ニュース詳細ページ)
- app/news/categories/[id]/page.tsx (カテゴリー別ニュースページ)

## 実装計画
1. バックエンドの実装
   - マイグレーションファイルの作成
   - モデルの実装
   - GraphQLスキーマの更新
   - シードデータの作成
2. フロントエンドの実装
   - GraphQLクエリの作成
   - コンポーネントの実装
   - ページの実装
3. テストの実装
   - モデルのテスト
   - GraphQLのテスト
   - フロントエンドのテスト
