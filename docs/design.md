# 福岡遊び アプリケーション設計書

## 要件定義書

### 概要
「福岡遊び」は、福岡の遊び場所を探すためのWebアプリケーションです。ユーザーは様々なカテゴリー（カフェ、レストラン、アクティビティなど）から場所を探すことができます。

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
