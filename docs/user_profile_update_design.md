# ユーザープロフィール更新機能設計書

## 概要
ユーザーがプロフィール情報（ユーザー名、Instagram URL、自己紹介文、プロフィール画像）を更新する機能です。
GraphQL の Mutation を通してサーバーに送信されたデータを `User` モデルに保存します。
画像は ActiveStorage を使用し、開発環境では Minio、本番環境では S3 に保存します。

## 要件定義

### 機能要件
- ユーザーは以下の情報を更新できる
  - ユーザー名
  - Instagram URL
  - 自己紹介文
  - プロフィール画像
- 画像アップロードは ActiveStorage を使用
- 開発環境では Minio、本番環境では S3 に画像を保存
- 既存の `users.profile_image_url` は文字列として保存し、画像データは ActiveStorage で管理

### 非機能要件
- セキュリティ：認証済みユーザーのみがプロフィール更新可能
- パフォーマンス：画像アップロードは非同期処理
- 拡張性：将来的に他のプロフィール項目を追加しやすい設計

## 設計

### データベース設計
- 既存の `users` テーブルを使用
- ActiveStorage の関連テーブルが自動的に追加される
  - `active_storage_blobs`
  - `active_storage_attachments`
  - `active_storage_variant_records`

### モデル設計
- `User` モデルに `has_one_attached :avatar` を追加
- 既存の `profile_image_url` フィールドは維持

### GraphQL設計
- 既存の `UpdateUserProfile` ミューテーションを拡張
  - Base64エンコードされた画像データを受け取るための引数を追加
  - 画像データをデコードして ActiveStorage に保存
- `UserType` に avatar_url フィールドを追加
  - ActiveStorage の URL ヘルパーを使用して画像の URL を返す

### ストレージ設計
- 開発環境：Minio（S3互換ストレージ）
- 本番環境：AWS S3
- `storage.yml` に両方の設定を追加

## 実装計画

1. ActiveStorage のマイグレーションを実行
2. `User` モデルに ActiveStorage の関連付けを追加
3. `storage.yml` に Minio と S3 の設定を追加
4. 環境設定ファイルを更新
5. `UpdateUserProfile` ミューテーションを更新
6. `UserType` に avatar_url フィールドを追加
7. テストを作成・実行

## セキュリティ考慮事項
- アップロードされる画像のバリデーション（サイズ、タイプ）
- 認証・認可の確認
- CSRF対策

## テスト計画
- ユニットテスト：モデルのバリデーション
- インテグレーションテスト：GraphQLミューテーションのテスト
- E2Eテスト：フロントエンドからのアップロードテスト
