# GraphQL Codegen Types Usage Guide

このドキュメントでは、GraphQL Code Generator で自動生成された型を使用する方法について説明します。

## 概要

このプロジェクトでは、GraphQL スキーマから TypeScript の型定義を自動生成しています。
手動で型定義を作成する代わりに、これらの自動生成された型を使用することで以下のメリットがあります：

- ✅ **スキーマ変更との自動同期**: GraphQL スキーマが変更されると、型も自動的に更新されます
- ✅ **型の二重管理を解消**: 手動定義と生成型の不整合を防ぎます
- ✅ **Single Source of Truth**: GraphQL スキーマが唯一の真実の情報源となります
- ✅ **型安全性の向上**: コンパイル時に型エラーを検出できます

## 生成された型の場所

### Frontend
- **生成ファイル**: `frontend/src/__generated__/`
  - `graphql.ts` - すべてのGraphQL型定義
  - `types.ts` - クエリとミューテーションの型定義
  - `gql.ts` - GraphQL文字列のタグ付きテンプレート関数

### Admin
- **生成ファイル**: `admin/src/__generated__/`
  - `graphql.ts` - すべてのGraphQL型定義
  - `types.ts` - クエリとミューテーションの型定義
  - `gql.ts` - GraphQL文字列のタグ付きテンプレート関数

## 型の再生成

GraphQL スキーマまたはクエリ/ミューテーションを変更した場合、以下のコマンドで型を再生成します：

```bash
# Frontend
cd frontend
npm run generate

# Admin
cd admin
npm run generate
```

## 使用方法

### 1. Query/Mutation の型定義

#### ❌ 悪い例（手動定義）

```typescript
// 手動で型を定義 - スキーマと不整合が発生する可能性がある
interface GetUserFavoritesQuery {
  userFavorites: {
    id: string;
    playPlanId: string;
    // ...
  }[];
}
```

#### ✅ 良い例（自動生成型を使用）

```typescript
// GraphQL クエリと型を定義
import { gql } from '@apollo/client';

export const GET_USER_FAVORITES = gql`
  query GetUserFavorites {
    userFavorites {
      id
      playPlanId
      createdAt
      playPlan {
        id
        planName
        description
      }
    }
  }
`;

// 自動生成された型を再エクスポート
export type {
  GetUserFavoritesQuery,
  GetUserFavoritesQueryVariables,
} from '@/__generated__/types';
```

### 2. コンポーネントでの使用

```typescript
import { useQuery } from '@apollo/client';
import { GET_USER_FAVORITES, GetUserFavoritesQuery } from '@/graphql/favorites';

export const UserBookmarks: React.FC = () => {
  const { data, loading, error } = useQuery<GetUserFavoritesQuery>(
    GET_USER_FAVORITES
  );

  // data の型は自動的に推論され、型安全
  if (!data || !data.userFavorites) {
    return <div>データがありません</div>;
  }

  return (
    <div>
      {data.userFavorites.map((favorite) => (
        <div key={favorite.id}>{favorite.playPlan.planName}</div>
      ))}
    </div>
  );
};
```

### 3. Input 型の使用

GraphQL の Input 型も自動生成されています。

```typescript
import { UpdatePlayPlanInput } from '@/__generated__/graphql';

// フォームデータにInput型を使用
const handleSubmit = async (data: UpdatePlayPlanInput) => {
  await updatePlayPlan({
    variables: { input: data },
  });
};
```

### 4. UI 固有のフィールドが必要な場合

自動生成型を拡張して、UI 固有のフィールドを追加できます：

```typescript
import { UpdatePlayPlanInput } from '@/__generated__/graphql';

// UI固有のフィールドを含む拡張型
interface PlayPlanFormData extends Partial<UpdatePlayPlanInput> {
  // UI固有のフィールド
  newImages?: string[];
  deleteImageIds?: string[];
  imageUrls?: { id: string; url: string }[];
}
```

### 5. Enum 型の使用

GraphQL の Enum も自動生成されています：

```typescript
import { StatusEnum, TripTypeEnum } from '@/__generated__/graphql';

const plan = {
  status: StatusEnum.Published,
  tripType: TripTypeEnum.DayTrip,
};
```

### 6. GraphQL スキーマのイントロスペクション型

スキーマのメタデータ（Enum値など）を取得する場合：

```typescript
import { __EnumValue, __Type } from '@/__generated__/graphql';

interface QueryData {
  __type: __Type;
}

const { data } = useQuery<QueryData>(GET_ENUM_VALUES, {
  variables: { name: 'StatusEnum' },
});

const options = data?.__type?.enumValues?.map((enumValue: __EnumValue) => ({
  value: enumValue.name,
  label: enumValue.description || enumValue.name,
}));
```

## ベストプラクティス

### ✅ DO（推奨）

1. **常に自動生成型を使用する**: GraphQL クエリ/ミューテーションに対応する型は必ず生成型を使用
2. **型を再エクスポートする**: GraphQL 定義と同じファイルから型を再エクスポートし、インポートを簡単に
3. **スキーマ変更後は再生成**: GraphQL スキーマを変更したら、必ず `npm run generate` を実行
4. **null チェックを行う**: GraphQL の nullable フィールドには適切な null チェックを実装

```typescript
// 良い例
if (!data || !data.userFavorites) {
  return <Loading />;
}
```

### ❌ DON'T（非推奨）

1. **手動で型を定義しない**: GraphQL に対応する型を手動で作成しない
2. **生成ファイルを編集しない**: `__generated__/` 配下のファイルは編集しない（自動生成されるため）
3. **型のキャストを乱用しない**: 必要な場合のみ型キャストを使用

```typescript
// 悪い例 - 手動定義
interface UserFavoritesQuery {
  userFavorites: Favorite[];
}

// 良い例 - 自動生成型を使用
import { GetUserFavoritesQuery } from '@/__generated__/types';
```

## トラブルシューティング

### 型が見つからない場合

1. GraphQL クエリが正しく定義されているか確認
2. `npm run generate` を実行して型を再生成
3. IDE を再起動（型キャッシュの問題の場合）

### 型の不整合が発生した場合

1. GraphQL スキーマを確認
2. クエリ/ミューテーションで要求しているフィールドを確認
3. `npm run generate` を実行して最新の型を生成

### 生成された型が期待と異なる場合

1. `codegen.ts` の設定を確認
2. GraphQL スキーマが最新か確認（バックエンドと同期）
3. クエリで必要なフィールドをすべて要求しているか確認

## 参考リンク

- [GraphQL Code Generator 公式ドキュメント](https://the-guild.dev/graphql/codegen)
- [Apollo Client TypeScript ドキュメント](https://www.apollographql.com/docs/react/development-testing/static-typing/)
- [GraphQL 公式ドキュメント](https://graphql.org/)

## まとめ

GraphQL Code Generator の自動生成型を使用することで、型の整合性が保たれ、開発効率が向上します。
手動で型を定義する代わりに、必ず自動生成型を使用してください。
