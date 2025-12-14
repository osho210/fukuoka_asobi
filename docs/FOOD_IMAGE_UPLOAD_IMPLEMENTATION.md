# Food画像アップロード実装（Active Storage）

## 概要

Food（Menu）画像は、Active Storage を使用してバックエンド（Rails）で管理されています。
Cloudflare Pages（Edge Runtime）ではファイルシステムへの永続保存ができないため、画像アップロードは全てバックエンド経由で行われます。

## アーキテクチャ

```
Admin（Cloudflare Pages）
    ↓ Base64エンコードされた画像
    ↓ GraphQL mutation（createMenu / updateMenu）
Rails Backend
    ↓ ImageUploadService
Active Storage（MinIO / S3）
```

## 実装詳細

### 1. バックエンド（Rails）

#### Menu モデル
- `app/models/menu.rb`
- `has_one_attached :image` で画像を紐付け
- Active Storage を使用

#### GraphQL mutations
- `app/graphql/mutations/create_menu.rb`
- `app/graphql/mutations/update_menu.rb`
- `image` 引数として Base64 エンコードされた画像データを受け取る
- `ImageUploadService.attach_base64_images` で画像を添付

#### ImageUploadService
- `app/services/image_upload_service.rb`
- Base64 データをデコードして Active Storage に保存
- ファイル名を自動生成（`menu_{id}_{timestamp}_{index}.{extension}`）

#### Active Storage 設定
- **開発環境**: MinIO（S3互換ストレージ）
- **本番環境**: 環境変数 `ACTIVE_STORAGE_SERVICE` で指定（MinIO / S3 / R2 など）
- 設定ファイル: `config/storage.yml`

### 2. Admin（Cloudflare Pages）

#### 画像アップロードコンポーネント
- `admin/src/components/forms/SingleImageUpload.tsx`
- ファイルを選択 → Base64 に変換
- GraphQL mutation の `image` 引数として送信

#### ModelDetailModal
- `admin/src/components/ModelDetailModal.tsx`
- Menu モデルの場合、`SingleImageUpload` コンポーネントを使用
- `handleChange('image', base64Image)` で Base64 データを設定

#### GraphQL mutations
- `admin/src/graphql/mutations/menus.ts`
- `CreateMenuInput` / `UpdateMenuInput` に `image` フィールドを含む
- レスポンスで `imageUrl { id, url }` を受け取る

#### モデル設定
- `admin/src/lib/modelConstants.ts`
- `menus` の `fields` で `{ name: 'image', type: 'image_upload' }` を定義

## データフロー

### 画像作成時
1. ユーザーが画像を選択
2. `SingleImageUpload` が Base64 に変換
3. `createMenu` mutation で `{ image: "data:image/jpeg;base64,..." }` を送信
4. バックエンドが Base64 をデコードして Active Storage に保存
5. Menu レコードに画像が紐付けられる
6. レスポンスで `imageUrl.url` を返す

### 画像更新時
1. ユーザーが新しい画像を選択
2. `SingleImageUpload` が Base64 に変換
3. `updateMenu` mutation で `{ image: "data:image/jpeg;base64,..." }` を送信
4. バックエンドが既存画像を削除して新しい画像を保存
5. レスポンスで新しい `imageUrl.url` を返す

### 画像削除時
1. ユーザーが削除ボタンをクリック
2. `updateMenu` mutation で `{ deleteImage: true }` を送信
3. バックエンドが画像を削除（`image.purge`）

## 廃止された実装

### `/api/upload` エンドポイント（削除済み）
- `admin/src/app/api/upload/route.ts` は削除されました
- Cloudflare Pages では `fs`, `path`, `process.cwd()` が使用不可のため
- 実際には使用されていなかった（全モデルが Base64 経由で画像をアップロード）

### FileUpload コンポーネント（未使用）
- `admin/src/components/forms/FileUpload.tsx` は残っていますが、現在は使用されていません
- 将来的に他の用途で使用される可能性があるため、コンポーネント自体は削除していません

## 環境変数

### 開発環境（Docker）
- `MINIO_ROOT_USER`: minioadmin
- `MINIO_ROOT_PASSWORD`: minioadmin
- `MINIO_ENDPOINT`: http://minio:9000
- `MINIO_BUCKET`: fukuoka-asobi-dev

### 本番環境
- `ACTIVE_STORAGE_SERVICE`: minio_production / amazon / など
- `MINIO_ROOT_USER`: MinIO ユーザー名
- `MINIO_ROOT_PASSWORD`: MinIO パスワード
- `MINIO_ENDPOINT`: MinIO エンドポイント URL
- `MINIO_BUCKET`: バケット名

## トラブルシューティング

### 画像がアップロードできない
- MinIO が起動しているか確認（`docker-compose ps`）
- MinIO のバケットが作成されているか確認
- GraphQL mutation のログを確認（`ImageUploadService` のエラー）

### 画像 URL が表示されない
- Menu クエリに `imageUrl { id, url }` が含まれているか確認
- 開発環境の URL 変換が正しく行われているか確認（MinIO の `http://minio:9000` → `http://localhost:9000`）

### Cloudflare Pages のビルドエラー
- `/api/upload` エンドポイントが削除されているか確認
- `fs`, `path` などの Node.js モジュールを使用していないか確認

## 関連ファイル

### バックエンド
- `app/models/menu.rb`
- `app/services/image_upload_service.rb`
- `app/graphql/mutations/create_menu.rb`
- `app/graphql/mutations/update_menu.rb`
- `app/graphql/types/menu_type.rb`
- `config/storage.yml`
- `config/environments/development.rb`
- `config/environments/production.rb`

### Admin
- `admin/src/components/forms/SingleImageUpload.tsx`
- `admin/src/components/ModelDetailModal.tsx`
- `admin/src/graphql/mutations/menus.ts`
- `admin/src/graphql/queries/getMenus.ts`
- `admin/src/lib/modelConstants.ts`
- `admin/src/lib/modelGraphQL.ts`
