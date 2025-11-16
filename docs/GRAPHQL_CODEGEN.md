# GraphQL Code Generator 運用ガイド

このドキュメントでは、GraphQL Code Generatorを使用したスキーマ駆動開発のワークフローについて説明します。

## 概要

このプロジェクトでは、GraphQL Code Generatorを使用してバックエンドのGraphQLスキーマから自動的にTypeScript型定義を生成しています。

### 生成される型定義の場所

- **Frontend**: `frontend/src/__generated__/`
- **Admin**: `admin/src/__generated__/`

各ディレクトリには以下のファイルが生成されます：
- `graphql.ts` - GraphQLスキーマから生成されたすべての型定義
- `types.ts` - クエリ/ミューテーションの型定義
- `gql.ts` - gql関数のラッパー
- `index.ts` - エクスポートインデックス
- `fragment-masking.ts` - フラグメントマスキング用ユーティリティ

## セットアップ

### 1. 依存関係のインストール

プロジェクトルートで以下を実行：

```bash
npm install
```

### 2. バックエンドの起動

GraphQL Code Generatorはバックエンドサーバーからスキーマを取得するため、まずバックエンドを起動する必要があります：

```bash
cd backend
rails server # デフォルトはポート3000
```

### 3. 型定義の生成

フロントエンドまたは管理画面のディレクトリで以下を実行：

```bash
# Frontend
cd frontend
npm run generate

# Admin
cd admin
npm run generate
```

または、プロジェクトルートから：

```bash
# Frontend
npm run generate -w frontend

# Admin
npm run generate -w admin
```

## 開発ワークフロー

### スキーマ変更時の手順

1. **バックエンドでスキーマを変更**
   - `backend/app/graphql/types/` 内の型定義ファイルを編集
   - または新しいクエリ/ミューテーションを追加

2. **バックエンドサーバーを再起動**
   ```bash
   cd backend
   rails server
   ```

3. **型定義を再生成**
   ```bash
   cd frontend  # または admin
   npm run generate
   ```

4. **生成された型を使用**
   ```typescript
   // ❌ 手動で型定義を作成しない
   interface Spot {
     id: string;
     spotName: string;
   }
   
   // ✅ 生成された型を使用
   import { Spot } from '@/__generated__/graphql';
   ```

### クエリ/ミューテーション作成時の手順

1. **GraphQLクエリ/ミューテーションを作成**
   
   `frontend/src/graphql/queries/getSpots.ts`:
   ```typescript
   import { gql } from '@apollo/client';
   
   export const GET_SPOTS = gql`
     query GetSpots {
       spots {
         id
         spotName
         address
         district {
           id
           districtName
         }
       }
     }
   `;
   ```

2. **型定義を再生成**
   ```bash
   npm run generate
   ```

3. **生成された型をインポートして使用**
   ```typescript
   import { useQuery } from '@apollo/client';
   import { GET_SPOTS } from '@/graphql/queries/getSpots';
   import { GetSpotsQuery } from '@/__generated__/types';
   
   function SpotList() {
     const { data } = useQuery<GetSpotsQuery>(GET_SPOTS);
     
     return (
       <div>
         {data?.spots.map(spot => (
           <div key={spot.id}>{spot.spotName}</div>
         ))}
       </div>
     );
   }
   ```

## ベストプラクティス

### ✅ DO（推奨）

1. **常に生成された型を使用する**
   ```typescript
   import { Spot, Event, News } from '@/__generated__/graphql';
   ```

2. **クエリごとに専用の型を使用する**
   ```typescript
   import { GetSpotsQuery } from '@/__generated__/types';
   const { data } = useQuery<GetSpotsQuery>(GET_SPOTS);
   ```

3. **スキーマ変更後は必ず型定義を再生成する**
   ```bash
   npm run generate
   ```

4. **生成されたファイルはGitにコミットする**
   - `__generated__` ディレクトリはバージョン管理対象です

### ❌ DON'T（非推奨）

1. **手動で型定義を作成しない**
   ```typescript
   // ❌ これは避ける
   interface Spot {
     id: string;
     spotName: string;
   }
   ```

2. **生成されたファイルを手動で編集しない**
   - `__generated__` 内のファイルは自動生成されるため、手動編集は上書きされます

3. **`any` 型を使用しない**
   ```typescript
   // ❌ これは避ける
   const { data } = useQuery<any>(GET_SPOTS);
   
   // ✅ 適切な型を使用
   const { data } = useQuery<GetSpotsQuery>(GET_SPOTS);
   ```

## トラブルシューティング

### 型生成が失敗する場合

1. **バックエンドが起動しているか確認**
   ```bash
   curl http://localhost:3000/graphql
   ```

2. **GraphQLエンドポイントが正しいか確認**
   - `codegen.ts` の `schema` 設定を確認

3. **GraphQLクエリの構文エラーを確認**
   - エラーメッセージを確認してクエリを修正

### 型が更新されない場合

1. **キャッシュをクリアして再生成**
   ```bash
   rm -rf src/__generated__
   npm run generate
   ```

2. **IDE/エディタを再起動**
   - TypeScriptの型キャッシュをリフレッシュ

## 設定ファイル

### frontend/codegen.ts

```typescript
import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: [
        {
            "http://localhost:3000/graphql": {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            },
        },
    ],
    documents: ["src/**/*.tsx","src/**/*.ts","src/**/*.graphql"],
    generates: {
        "./src/__generated__/": {
            preset: "client",
            presetConfig: {
                gqlTagName: "gql"
            }
        },
        "./src/__generated__/types.ts": {
            plugins: ["typescript", "typescript-operations"]
        },
    },
    ignoreNoDocuments: true,
};

export default config;
```

## まとめ

- **スキーマが真実の源泉**: バックエンドのGraphQLスキーマから型定義を自動生成
- **型安全性の保証**: コンパイル時に型エラーを検出
- **メンテナンス性の向上**: 手動での型定義管理が不要
- **開発効率の向上**: スキーマ変更が即座にフロントエンドに反映

このワークフローにより、スキーマ駆動開発を実現し、型の整合性を保ちながら効率的に開発を進めることができます。
