# 福岡遊び日記 アプリケーション設計書

## 要件定義書

### 概要
「福岡遊び日記」は、福岡の遊び場所を探すためのWebアプリケーションです。ユーザーは様々なカテゴリー（カフェ、レストラン、アクティビティなど）から場所を探すことができます。

### 機能要件
- カテゴリー一覧の表示
- カテゴリー別の場所一覧表示（将来実装）
- 場所の詳細情報表示（将来実装）
- お気に入り登録機能（将来実装）
- レビュー投稿機能（将来実装）

## 設計書

### システム構成
- **フロントエンド**: Next.js + TypeScript + Apollo Client
- **バックエンド**: Ruby on Rails + GraphQL
- **データベース**: SQLite（開発環境）、PostgreSQL（本番環境）

### GraphQL通信設計

#### バックエンド（Rails）
1. **GraphQLスキーマ**
   - `Query`: アプリケーションのエントリーポイント
   - `Types`: データモデルを表現するオブジェクト型
   - `Mutations`: データ更新操作（将来実装）

2. **モデル**
   - `Category`: カテゴリー情報を管理
     - 属性: id, name, created_at, updated_at
   - `MenuCategory`: メニューのカテゴリー情報を管理
     - 属性: id, name, created_at, updated_at
   - `Menu`: メニュー情報を管理
     - 属性: id, menu_name, price, description, menu_category_id, created_at, updated_at
   - `Place`: 場所情報を管理（将来実装）
     - 属性: id, name, description, address, category_id, created_at, updated_at

3. **CORS設定**
   - フロントエンドからのクロスオリジンリクエストを許可
   - 開発環境では `localhost:8200` からのリクエストを許可

#### フロントエンド（Next.js）
1. **Apollo Client設定**
   - GraphQLエンドポイント: `http://localhost:3000/graphql`
   - キャッシュ戦略: InMemoryCache

2. **コンポーネント構成**
   - `ApolloWrapper`: Apollo Clientの設定とプロバイダー
   - `Categories`: カテゴリー一覧表示コンポーネント

3. **GraphQLクエリ**
   - `GET_CATEGORIES`: カテゴリー一覧を取得するクエリ
   ```graphql
   query Categories {
     categories {
       id
       name
       createdAt
       updatedAt
     }
   }
   ```

### 命名規則
- **GraphQLフィールド名**: camelCase（例: createdAt）
- **Railsデータベースカラム名**: snake_case（例: created_at）

### セキュリティ対策
- CSRF対策: GraphQLコントローラーでの認証トークン検証
- CORS設定: 許可されたオリジンからのリクエストのみ受け付け

## Google Places API連携機能

### 概要
Google Places APIと連携して、スポット情報を自動的に取得・同期する機能を実装。

### 主要機能
1. **Google Places検索**
   - キーワード検索でGoogle Places APIからスポット情報を取得
   - 位置情報（緯度経度）と検索半径を指定可能

2. **スポット情報同期**
   - 既存スポットとGoogle Places APIの情報を同期
   - Google Place IDまたは検索クエリを使用して同期

3. **拡張データ取得**
   - 基本情報（名前、住所、電話番号、ウェブサイト等）
   - 営業時間情報
   - レビュー・評価情報
   - 決済・駐車場オプション
   - サービス提供情報（テイクアウト、配達等）
   - アクセシビリティ情報
   - 写真情報

### データベース拡張
- **spotsテーブル**: Google Places API関連フィールドを追加
- **spot_photos**: Google Places写真情報
- **accessibility_options**: アクセシビリティオプション
- **spot_accessibility_options**: スポット-アクセシビリティ中間テーブル
- **opening_hours**: Google Places営業時間データ統合

### GraphQL API
- **Query**: `searchGooglePlaces` - Google Places検索
- **Mutation**: `syncSpotWithGooglePlaces` - スポット同期

### サービスクラス
- **GooglePlacesService**: Google Places API通信
- **SpotSyncService**: スポット情報同期処理

### セキュリティ
- Google Places API キーは Rails credentials で管理
- APIキーはバックエンドでのみ使用、フロントエンドには露出しない

## 実装上の注意点

### GraphQL通信における注意点
1. **フィールド名の変換**
   - Rails（snake_case）とGraphQL（camelCase）の命名規則の違いに注意
   - 自動変換されるフィールドと手動で変換が必要なフィールドを把握

2. **CORS設定**
   - 開発環境と本番環境で適切なオリジン設定を行う
   - クレデンシャル付きリクエストの取り扱いに注意

3. **Next.jsのサーバーコンポーネントとクライアントコンポーネント**
   - Apollo Clientはクライアントコンポーネントでのみ使用可能
   - `use client` ディレクティブの適切な使用

### Google Places API連携における注意点
1. **API制限とコスト管理**
   - Google Places APIの使用量制限に注意
   - 必要なフィールドのみを取得してコストを最適化

2. **データ同期戦略**
   - 既存データとAPIデータの競合解決
   - 同期失敗時のエラーハンドリング

3. **レート制限対応**
   - API呼び出し頻度の制御
   - リトライ機能の実装

## 雑誌連携機能

### 概要
雑誌掲載情報を管理し、スポット情報と連携する機能。

### データベース拡張

```mermaid
erDiagram
    spots ||--o{ spot_magazines : "掲載"
    spot_magazines }o--|| magazines : "掲載"

    spots {
        bigint id PK
        varchar spot_name
        -- 他カラムは省略 --
    }

    magazines {
        bigint id PK
        varchar name "雑誌名"
        date release_date "発売日"
        varchar sales_info "販売情報"
        varchar sales_url "販売URL"
        string publisher "出版社名"
        string issue_number "号数"
        string cover_image_url "表紙画像URL"
        text description "概要"
        enum status "公開ステータス"
        datetime created_at
        datetime updated_at
    }

    spot_magazines {
        bigint spot_id PK, FK
        bigint magazine_id PK, FK
        string publication_feature "掲載特集名"
        integer page_number "掲載ページ"
        text notes "備考"
        datetime created_at
        datetime updated_at
    }
```

### GraphQL API
- **Query**: `magazines`, `magazine`
- **Mutation**: `createMagazine`, `updateMagazine`, `deleteMagazine` (管理者向け)
- **Types**: `MagazineType`, `SpotMagazineType`
