# ユーザー閲覧履歴機能 設計書

## 1. 要件定義

ユーザーが閲覧したコンテンツ（ニュース、雑誌、遊びプラン）の履歴を記録し、後から参照できるようにする。

### 主な機能
- ユーザーがコンテンツを閲覧した際に履歴を自動記録
- 同じユーザーが同じコンテンツを複数回閲覧した場合、最新の閲覧日時のみ保持
- ユーザーは自分の閲覧履歴を時系列で確認可能
- 閲覧対象の種類（News、Magazine、PlayPlan）でフィルタリング可能

## 2. データベース設計

### user_histories テーブル

| カラム名 | 型 | NULL | 説明 |
|---------|-----|------|------|
| id | bigint | NOT NULL | 主キー |
| user_id | bigint | NOT NULL | ユーザーID（外部キー） |
| viewable_type | string | NOT NULL | 閲覧対象の型（ポリモーフィック） |
| viewable_id | bigint | NOT NULL | 閲覧対象のID（ポリモーフィック） |
| viewed_at | datetime | NOT NULL | 閲覧日時 |
| created_at | datetime | NOT NULL | 作成日時 |
| updated_at | datetime | NOT NULL | 更新日時 |

### インデックス
- `index_user_histories_on_user_and_viewable`: (user_id, viewable_type, viewable_id) - ユニーク制約なし
- `index_user_histories_on_viewed_at`: viewed_at - ソート用
- `index_user_histories_on_user_id`: user_id - 外部キー

### 外部キー制約
- `user_id` → `users.id` (on_delete: cascade)

### ポリモーフィック関連
`viewable` として以下のモデルが対象：
- `News`
- `Magazine`
- `PlayPlan`

## 3. モデル設計

### UserHistory モデル

```ruby
class UserHistory < ApplicationRecord
  belongs_to :user
  belongs_to :viewable, polymorphic: true

  validates :user_id, presence: true
  validates :viewable_type, presence: true
  validates :viewable_id, presence: true
  validates :viewed_at, presence: true

  # スコープ
  scope :latest, -> { order(viewed_at: :desc) }
  scope :by_user, ->(user_id) { where(user_id: user_id) }
  scope :by_type, ->(type) { where(viewable_type: type) }
  scope :within_period, ->(start_date, end_date) { where(viewed_at: start_date..end_date) }

  # クラスメソッド
  def self.record_view(user_id, viewable)
    # 同じユーザーと閲覧対象の組み合わせを検索または初期化
    # 既存の場合はviewed_atのみ更新、新規の場合は作成
  end
end
```

### 既存モデルへの追加

#### User モデル
```ruby
has_many :user_histories, dependent: :destroy
```

#### News モデル
```ruby
has_many :user_histories, as: :viewable, dependent: :destroy
```

#### Magazine モデル
```ruby
has_many :user_histories, as: :viewable, dependent: :destroy
```

#### PlayPlan モデル
```ruby
has_many :user_histories, as: :viewable, dependent: :destroy
```

## 4. GraphQL API設計

### Types

#### UserHistoryType
```graphql
type UserHistory {
  id: ID!
  userId: Int!
  viewableType: String!
  viewableId: Int!
  viewedAt: ISO8601DateTime!
  createdAt: ISO8601DateTime!
  updatedAt: ISO8601DateTime!
  user: User!
  viewable: ViewableUnion
}
```

#### ViewableUnion
```graphql
union ViewableUnion = News | Magazine | PlayPlan
```

### Queries

#### userHistories
```graphql
userHistories(
  viewableType: String
  limit: Int
): [UserHistory!]
```

**説明**: ログインユーザーの閲覧履歴を取得する

**引数**:
- `viewableType` (オプション): 閲覧対象の型でフィルタリング（"News", "Magazine", "PlayPlan"）
- `limit` (オプション): 取得件数の制限

**戻り値**: UserHistoryの配列（閲覧日時の降順）

**認証**: 必須（ログインユーザーのみ）

### Mutations

#### recordUserHistory
```graphql
recordUserHistory(
  viewableType: String!
  viewableId: ID!
): RecordUserHistoryPayload!
```

**説明**: ユーザーの閲覧履歴を記録する

**引数**:
- `viewableType`: 閲覧対象の型（"News", "Magazine", "PlayPlan"）
- `viewableId`: 閲覧対象のID

**戻り値**:
```graphql
type RecordUserHistoryPayload {
  userHistory: UserHistory
  errors: [String!]!
}
```

**認証**: 必須（ログインユーザーのみ）

## 5. ファイル構成

### Backend

#### モデル
- `backend/app/models/user_history.rb`

#### マイグレーション
- `backend/db/migrate/20260207105851_create_user_histories.rb`

#### GraphQL Types
- `backend/app/graphql/types/user_history_type.rb`
- `backend/app/graphql/types/viewable_union.rb`

#### GraphQL Resolvers
- `backend/app/graphql/resolvers/user_histories_resolver.rb`

#### GraphQL Mutations
- `backend/app/graphql/mutations/record_user_history.rb`

#### GraphQL 登録
- `backend/app/graphql/types/query_type.rb` - `user_histories` クエリを追加
- `backend/app/graphql/types/mutation_type.rb` - `record_user_history` ミューテーションを追加

#### テスト
- `backend/spec/models/user_history_spec.rb`
- `backend/spec/factories/user_histories.rb`

## 6. 実装の詳細

### 6.1 閲覧履歴の記録タイミング

閲覧履歴は、ユーザーが以下のページにアクセスした際に記録される：
- ニュース詳細ページ
- 雑誌詳細ページ
- 遊びプラン詳細ページ

フロントエンドから `recordUserHistory` ミューテーションを呼び出すことで記録される。

### 6.2 重複レコードの扱い

同じユーザーが同じコンテンツを複数回閲覧した場合：
- 新しいレコードは作成せず、既存のレコードの `viewed_at` のみ更新
- `UserHistory.record_view` メソッドで `find_or_initialize_by` を使用して実装

### 6.3 パフォーマンス最適化

- `viewed_at` カラムにインデックスを設定し、時系列ソートを高速化
- `user_id`, `viewable_type`, `viewable_id` の複合インデックスで検索を高速化
- クエリ実行時に `limit` 引数で取得件数を制限可能

### 6.4 プライバシーとセキュリティ

- ユーザーは自分の閲覧履歴のみアクセス可能（`context[:current_user]` でチェック）
- 未認証ユーザーは閲覧履歴にアクセス不可
- ユーザー削除時に閲覧履歴も自動削除（`dependent: :destroy`）

## 7. 使用例

### フロントエンド実装例

#### 閲覧履歴の記録（詳細ページで実行）
```typescript
import { useMutation } from '@apollo/client';
import { RECORD_USER_HISTORY } from '@/graphql/mutations/recordUserHistory';

function NewsDetailPage({ newsId }: { newsId: string }) {
  const [recordHistory] = useMutation(RECORD_USER_HISTORY);

  useEffect(() => {
    recordHistory({
      variables: {
        viewableType: 'News',
        viewableId: newsId,
      },
    });
  }, [newsId, recordHistory]);

  // ... ニュース詳細の表示
}
```

#### 閲覧履歴の取得（マイページで表示）
```typescript
import { useQuery } from '@apollo/client';
import { GET_USER_HISTORIES } from '@/graphql/queries/getUserHistories';

function UserHistoryPage() {
  const { data, loading } = useQuery(GET_USER_HISTORIES, {
    variables: {
      limit: 50,
    },
  });

  if (loading) return <div>読み込み中...</div>;

  return (
    <div>
      <h1>閲覧履歴</h1>
      {data?.userHistories?.map((history) => (
        <div key={history.id}>
          <span>{history.viewableType}</span>
          <span>{history.viewedAt}</span>
        </div>
      ))}
    </div>
  );
}
```

## 8. 今後の拡張案

### 8.1 閲覧履歴の分析
- ユーザーの興味関心分析
- レコメンデーション機能への活用

### 8.2 履歴のエクスポート
- CSV形式で閲覧履歴をダウンロード

### 8.3 履歴の削除機能
- 個別の履歴削除
- 全履歴のクリア

### 8.4 閲覧統計
- 人気コンテンツのランキング
- 閲覧数のトレンド分析

## 9. テスト計画

### 9.1 モデルテスト (RSpec)
- [x] アソシエーションのテスト
- [x] バリデーションのテスト
- [x] スコープのテスト
- [x] `record_view` メソッドのテスト
- [x] ポリモーフィック関連のテスト
- [x] 関連削除のテスト

### 9.2 GraphQL テスト
- [ ] `userHistories` クエリのテスト
- [ ] `recordUserHistory` ミューテーションのテスト
- [ ] 認証チェックのテスト
- [ ] フィルタリング機能のテスト

### 9.3 統合テスト
- [ ] フロントエンドからの閲覧履歴記録
- [ ] フロントエンドでの閲覧履歴表示

## 10. 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2026-02-07 | 1.0.0 | 初版作成 |
