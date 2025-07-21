# 雑誌（Magazine）管理機能 設計書

## 1. 要件定義

管理者ユーザーは、雑誌（Magazine）情報を管理画面から作成、閲覧、更新、削除できる。
管理項目は `magazines` テーブルのカラムに対応する。

- `name` (雑誌名)
- `release_date` (発売日)
- `sales_info` (販売情報)
- `sales_url` (販売URL)
- `publisher` (出版社名)
- `issue_number` (号数)
- `cover_image_url` (表紙画像URL)
- `description` (概要)
- `status` (公開ステータス)

## 2. 概略設計

### バックエンド (Rails / GraphQL)

- `Magazine` モデルのCRUD操作に対応するGraphQLミューテーションを実装する。
- `Magazine` の一覧取得、個別取得に対応するGraphQLクエリを実装する。

### フロントエンド (Next.js / Admin)

- 既存の管理画面のUIコンポーネントを再利用し、`Magazine` の管理ページを構築する。
- `/magazines` というパスで雑誌一覧ページにアクセスできるようにする。
- 一覧ページには、雑誌の作成、編集、削除を行うためのUIを設ける。

## 3. 機能設計

### GraphQL API

#### Queries

- `magazines`: 雑誌の一覧をページネーション付きで取得する。
- `magazine(id: ID!)`: 指定したIDの雑誌情報を取得する。

#### Mutations

- `createMagazine(input: CreateMagazineInput!)`: 雑誌を新規作成する。
- `updateMagazine(input: UpdateMagazineInput!)`: 雑誌情報を更新する。
- `deleteMagazine(input: DeleteMagazineInput!)`: 雑誌を削除する。

### 管理画面

#### 一覧ページ (`/magazines`)

- 雑誌の一覧をテーブル形式で表示する。
- 表示項目: `id`, `name`, `publisher`, `issue_number`, `status`, `release_date`
- 新規作成ボタンを配置する。
- 各行に編集ボタンと削除ボタンを配置する。

#### 作成・編集モーダル

- `magazines` テーブルの全カラムを編集可能なフォームを表示する。
- `status` はプルダウンで選択できるようにする (`draft`, `published`)。
- `release_date` はカレンダーUIで選択できるようにする。

## 4. クラス・ファイル構成

### Backend

- `app/models/magazine.rb`
- `app/graphql/types/magazine_type.rb`
- `app/graphql/types/query_type.rb`
- `app/graphql/types/mutation_type.rb`
- `app/graphql/mutations/create_magazine.rb`
- `app/graphql/mutations/update_magazine.rb`
- `app/graphql/mutations/delete_magazine.rb`
- `app/graphql/inputs/magazine_input.rb`

### Frontend

- `admin/src/graphql/queries/getMagazines.ts`
- `admin/src/graphql/mutations/magazines.ts`
- `admin/src/lib/modelConstants.ts`: `Magazine`モデルのカラム定義、表示設定を追加
- `admin/src/lib/modelRouteMap.ts`: `magazines`ルートと`Magazine`モデルのマッピングを追加
- `admin/src/lib/modelGraphQL.ts`: `magazines`ルートとGraphQL操作のマッピングを追加
