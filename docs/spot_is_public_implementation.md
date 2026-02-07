# スポット公開可否フラグ実装ドキュメント

## 概要
spotsテーブルに公開可否フラグ（`is_public:boolean`）を追加し、管理画面で公開/非公開を切り替えられるUI、およびフロントエンドで公開されているスポットのみ取得するように変更しました。

## 実装内容

### 1. データベース変更

#### Migration
- ファイル: `backend/db/migrate/20260207104827_add_is_public_to_spots.rb`
- カラム追加: `is_public:boolean, null: false, default: true`
- up/down メソッドを明示的に定義（rollback可能）

```ruby
class AddIsPublicToSpots < ActiveRecord::Migration[8.0]
  def up
    add_column :spots, :is_public, :boolean, null: false, default: true
  end

  def down
    remove_column :spots, :is_public
  end
end
```

**デフォルト値の設計判断:**
- `default: true` を採用
- 理由: 既存データが急に全て非表示になる事故を防ぐ（安全寄り）
- 既存スポットは引き続き表示される

### 2. バックエンド（Rails）

#### Spotモデル
- ファイル: `backend/app/models/spot.rb`
- 公開済みスポットのみを取得するスコープを追加

```ruby
scope :publicly_visible, -> { where(is_public: true) }
```

#### GraphQL Type
- ファイル: `backend/app/graphql/types/spot_type.rb`
- `is_public` フィールドを追加

```ruby
field :is_public, Boolean, null: false
```

#### GraphQL Query
- ファイル: `backend/app/graphql/types/query_type.rb`
- `spots` クエリを公開済みのみ返すように変更

```ruby
def spots
  Spot.publicly_visible
end
```

#### GraphQL Mutations
- ファイル:
  - `backend/app/graphql/mutations/create_spot.rb`
  - `backend/app/graphql/mutations/update_spot.rb`
- `is_public` 引数を追加

```ruby
argument :is_public, Boolean, required: false
```

### 3. 管理画面（Admin）

#### GraphQL Mutations/Queries
- ファイル: `admin/src/graphql/mutations/spots.ts`
- CREATE_SPOT、UPDATE_SPOT mutation に `isPublic` フィールド追加

- ファイル: `admin/src/graphql/queries/getSpots.ts`
- GET_SPOTS、GET_SPOT query に `isPublic` フィールド追加

#### UI設定
- ファイル: `admin/src/lib/modelConstants.ts`
- スポット一覧テーブルに「公開」カラムを追加（公開/非公開の表示）
- スポット編集フォームに `isPublic` boolean フィールドを追加

```typescript
// テーブルカラム
{ 
  header: '公開', 
  accessorKey: 'isPublic', 
  sortable: true, 
  cell: (item: ModelData) => item.isPublic ? '公開' : '非公開' 
}

// フォームフィールド
{ name: 'isPublic', type: 'boolean', required: true }
```

### 4. フロントエンド（Frontend）

#### 影響範囲
- ファイル: `frontend/src/graphql/queries/getSpots.ts`
- 変更: なし（サーバー側のresolverで公開済みのみ返す）
- フロント側のクエリ文字列は変更不要

**設計判断:**
- フロント側でフィルタリングせず、サーバー側のresolverでフィルタリング
- 理由: セキュリティと一貫性（非公開データを送信しない）

### 5. テスト

#### Modelテスト
- ファイル: `backend/spec/models/spot_spec.rb`
- `publicly_visible` スコープのテスト追加

```ruby
describe '.publicly_visible' do
  it '公開されているスポットのみを返すこと'
end
```

#### GraphQLテスト
- ファイル: `backend/spec/graphql/types/query_type_spec.rb`
- `spots` クエリが公開済みのみ返すことをテスト

```ruby
it '公開されているスポットのみを返すこと' do
  # 公開スポット2件、非公開スポット1件を作成
  # spots クエリが公開スポット2件のみ返すことを確認
end
```

#### Factory
- ファイル: `backend/spec/factories/spots.rb`
- `is_public { true }` をデフォルト値として追加

## 受け入れ条件

- [x] spots.is_public が追加され、null: false で扱える
- [x] rollback 可能（down で元に戻せる）
- [x] admin で spot の公開/非公開を切り替えられる
- [x] frontend の GetSpots（spots フィールド）が 公開 spot のみ返す
- [ ] 非公開にした spot が frontend に表示されないことを確認できる（要手動確認）

## 影響範囲

### 既存データ
- `default: true` により、既存データは引き続き表示される
- データ移行作業は不要

### 他のクエリ/エンドポイント
- 本実装は `spots` クエリのみ対象
- 他のspot参照箇所（個別取得など）は変更なし
- 必要に応じて今後対応を検討

### パフォーマンス
- インデックスなし（必要に応じて追加可能）
- boolean カラムのフィルタリングは軽量

## 運用ガイド

### 公開/非公開の切り替え方法
1. 管理画面（Admin）にログイン
2. スポット一覧ページを開く
3. 編集したいスポットをクリック
4. 「公開」フィールドのチェックボックスをON/OFFで切り替え
5. 保存

### 確認方法
1. フロントエンド側でスポット一覧を表示
2. 非公開にしたスポットが表示されないことを確認
3. 再度公開にすると表示されることを確認

## セキュリティ

- CodeQL: 脆弱性なし
- 非公開データはフロントエンドに送信されない（サーバー側でフィルタ）
- 管理者権限チェック済み（CreateSpot、UpdateSpot mutation）

## 今後の拡張可能性

### 考慮事項
1. **公開日時予約**: 特定日時に自動公開/非公開
2. **公開範囲の細分化**: 会員限定公開など
3. **非公開理由の記録**: 管理用メモフィールド追加
4. **一括公開/非公開**: 複数スポットを一括操作

### インデックス追加検討
もしパフォーマンス問題が発生した場合:
```ruby
add_index :spots, :is_public
```

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2026-02-07 | 1.0.0 | 初版作成 |
