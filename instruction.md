# コーディング規約とレビューパターン

このドキュメントは、過去のコードレビューで指摘された内容をまとめたものです。
同じような問題を繰り返さないために、実装前に必ず確認してください。

## 目次
1. [TypeScript 型定義](#typescript-型定義)
2. [GraphQL 定義の配置](#graphql-定義の配置)
3. [関数型プログラミング](#関数型プログラミング)
4. [コンポーネント設計](#コンポーネント設計)
5. [ファイルフォーマット](#ファイルフォーマット)
6. [テスト](#テスト)
7. [UI/UX パターン](#uiux-パターン)

---

## TypeScript 型定義

### ❌ 絶対にやってはいけないこと

**any 型の使用は完全禁止**

```typescript
// ❌ NG - any型を使用している
const spotOptions = spotsData?.spots?.map((spot: any) => ({
  value: spot.id,
  label: spot.spotName,
}));

// ❌ NG - any型を使用している
const handleSubmit = async (data: any) => {
  // ...
};
```

### ✅ 正しい実装

**明示的な型定義を使用する**

```typescript
// ✅ OK - 明示的な型定義
type SpotOption = {
  id: string;
  spotName: string;
};

const spotOptions = spotsData?.spots?.map((spot: SpotOption) => ({
  value: spot.id,
  label: spot.spotName,
}));

// ✅ OK - GraphQL Codegen の型を使用
import { GetSpotsQuery } from '@/__generated__/graphql';

const spots: GetSpotsQuery['spots'] = spotsData?.spots || [];
```

### interface vs type

**常に `type` を使用する（プロジェクトの統一ルール）**

```typescript
// ❌ NG - interface を使用
interface ConsentRequest {
  id: string;
  spotId: string;
}

// ✅ OK - type を使用
type ConsentRequest = {
  id: string;
  spotId: string;
};
```

**理由**: プロジェクト全体で統一するため。`type` の方が柔軟性が高く、Union型やIntersection型も扱える。

---

## GraphQL 定義の配置

### ❌ やってはいけないこと

**ページコンポーネント内でGraphQLクエリ/ミューテーションを定義しない**

```typescript
// ❌ NG - page.tsx 内で定義
'use client';

const GET_SPOTS = gql`
  query GetSpots {
    spots {
      id
      spotName
    }
  }
`;

export default function SpotsPage() {
  const { data } = useQuery(GET_SPOTS);
  // ...
}
```

### ✅ 正しい実装

**専用ディレクトリに分離する**

```typescript
// ✅ OK - admin/src/graphql/queries/spots.ts
import { gql } from '@apollo/client';

export const GET_SPOTS = gql`
  query GetSpots {
    spots {
      id
      spotName
    }
  }
`;

// ✅ OK - page.tsx ではインポートのみ
import { GET_SPOTS } from '@/graphql/queries/spots';

export default function SpotsPage() {
  const { data } = useQuery(GET_SPOTS);
  // ...
}
```

**ディレクトリ構造**:
```
admin/src/
├── graphql/
│   ├── queries/
│   │   ├── spots.ts
│   │   ├── consents.ts
│   │   └── ...
│   └── mutations/
│       ├── spots.ts
│       ├── consents.ts
│       └── ...
└── app/
    └── spots/
        └── page.tsx
```

---

## 関数型プログラミング

### 高階関数（カリー化）の使用

**イベントハンドラーは高階関数として実装する**

```typescript
// ❌ NG - 命令型スタイル
const handleApprove = async (requestId: string) => {
  await updateStatus({ variables: { id: requestId, status: 'APPROVED' } });
};

<Button onClick={() => handleApprove(request.id)}>承諾</Button>
```

```typescript
// ✅ OK - 関数型スタイル（カリー化）
const handleApprove = (requestId: string) => async () => {
  await updateStatus({ variables: { id: requestId, status: 'APPROVED' } });
};

<Button onClick={handleApprove(request.id)}>承諾</Button>
```

### 関心の分離

**ロジックとDOMを分離する**

```typescript
// ❌ NG - ユーティリティ関数がDOM要素を返している
export const renderStatusIcon = (status: string) => {
  if (status === 'APPROVED') {
    return <CheckCircle className="text-green-600" />;
  }
  // ...
};
```

```typescript
// ✅ OK - ロジックのみを返す
// lib/utils.ts
export const getStatusIconType = (status: string): 'approved' | 'rejected' | 'pending' => {
  switch (status) {
    case 'APPROVED': return 'approved';
    case 'REJECTED': return 'rejected';
    default: return 'pending';
  }
};

// page.tsx
const renderStatusIcon = (status: string) => {
  const iconType = getStatusIconType(status);
  switch (iconType) {
    case 'approved':
      return <CheckCircle className="text-green-600" />;
    case 'rejected':
      return <XCircle className="text-red-600" />;
    case 'pending':
      return <Clock className="text-gray-400" />;
  }
};
```

---

## コンポーネント設計

### 共通関数の切り出し

**同じロジックが複数箇所で使われる場合は必ず共通化する**

```typescript
// ❌ NG - 各ページでクリップボード操作を実装
const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('コピーしました');
  } catch (error) {
    console.error('コピー失敗:', error);
  }
};
```

```typescript
// ✅ OK - 共通関数として切り出す
// lib/clipboardUtils.ts
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('クリップボードへのコピーに失敗しました:', error);
    return false;
  }
};

// 使用側
import { copyToClipboard } from '@/lib/clipboardUtils';

const handleCopy = async (text: string) => {
  const success = await copyToClipboard(text);
  if (success) {
    toast.success('コピーしました');
  } else {
    toast.error('コピーに失敗しました');
  }
};
```

### プレースホルダーの具体性

**プレースホルダーは具体的な例を示す**

```typescript
// ❌ NG - 曖昧なプレースホルダー
<Input placeholder="ユーザーID" />

// ✅ OK - 具体的な例
<Input placeholder="@fukuoka_cafe_lover" />
```

---

## ファイルフォーマット

### ファイル末尾の改行

**全てのファイルは末尾に改行を入れる**

```typescript
// ❌ NG - 末尾に改行がない
export const GET_SPOTS = gql`...`;
```

```typescript
// ✅ OK - 末尾に改行がある
export const GET_SPOTS = gql`...`;

```

**Ruby ファイルも同様**

```ruby
# ❌ NG
class CreateSpots < ActiveRecord::Migration[8.0]
  # ...
end
```

```ruby
# ✅ OK
class CreateSpots < ActiveRecord::Migration[8.0]
  # ...
end

```

---

## テスト

### RSpec テストの日本語記述

**テストケースは日本語で記述し、context/describe で適切に分割する**

```ruby
# ❌ NG - 英語記述、構造が浅い
describe ConsentRequest do
  it 'should be expired when expires_at is in the past' do
    # ...
  end
end
```

```ruby
# ✅ OK - 日本語記述、適切な階層構造
describe ConsentRequest do
  describe '#expired?' do
    context '有効期限が過去の場合' do
      it 'trueを返すこと' do
        request = create(:consent_request, expires_at: 1.day.ago)
        expect(request.expired?).to be true
      end
    end

    context '有効期限が未来の場合' do
      it 'falseを返すこと' do
        request = create(:consent_request, expires_at: 1.day.from_now)
        expect(request.expired?).to be false
      end
    end
  end
end
```

**パターン**:
- 単一条件: 「〇〇の場合、〇〇であること」
- 複数条件: context で分割し、「〇〇で〇〇の場合、〇〇であること」

---

## UI/UX パターン

### 成功/エラー通知

**将来実装予定（別Issue）**

- 成功時: トースト通知
- エラー時: モーダル（ダイアログ）

現在は仮実装として alert を使用しているが、将来的には統一されたパターンに変更予定。

### コンポーネントのインポート統一

**将来実装予定（別Issue）**

現状:
```typescript
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
```

将来:
```typescript
import { Button, Input, Card } from '@/components';
```

`admin/src/components/index.ts` を作成し、全コンポーネントを再エクスポートする。

---

## GraphQL Mutation の引数形式

### 必ず input オブジェクト形式を使用する

```ruby
# ❌ NG - 個別引数
class CreateSpot < Mutations::BaseMutation
  argument :spot_name, String, required: true
  argument :address, String, required: true
  # ...
end
```

```ruby
# ✅ OK - input オブジェクト形式
class CreateSpot < Mutations::BaseMutation
  argument :input, Types::Input::SpotInput, required: true

  def resolve(input:)
    # ...
  end
end
```

---

## HTTPレスポンス判定

### エラー配列の長さではなく、レスポンスオブジェクトの存在で判定する

```typescript
// ❌ NG - エラー配列で判定
onCompleted: (data) => {
  if (data.createSpot.errors.length === 0) {
    // 成功処理
  }
}
```

```typescript
// ✅ OK - レスポンスオブジェクトの存在で判定
onCompleted: (data) => {
  if (data?.createSpot?.spot) {
    // 成功処理
    router.push(`/spots/${data.createSpot.spot.id}`);
  } else if (data?.createSpot?.errors) {
    // エラー処理
    console.error(data.createSpot.errors);
  }
}
```

---

## データベース管理

### 固定文言もDBで管理する

**テンプレート文などの固定文言は、直接コードに書かずDBで管理する**

理由:
- バージョン管理が必要
- 運用中に文言を変更する可能性がある
- プレースホルダーの置換が必要

実装例:
- `dm_templates` テーブルで管理
- name, version, content, is_active カラムを持つ
- プレースホルダー機能（{{store_name}}, {{form_url}}）

---

## ナビゲーション設計

### 新機能は必ずサイドバーに追加する

**実装手順**:

1. `AuthenticatedLayout.tsx` のサイドバーにメニュー項目を追加
2. 関連機能は1つのエントリーポイントから遷移できるようにする
3. ページ内にナビゲーションボタンを配置する

例:
```typescript
// サイドバー
{
  name: '画像利用承諾管理',
  href: '/consent_requests',
  icon: ImageIcon,
}

// ページ内ナビゲーション
<div className="flex gap-2">
  <Button onClick={() => router.push('/dm_templates')}>
    DMテンプレート管理
  </Button>
  <Button onClick={() => router.push('/licensed_assets')}>
    承諾済み画像一覧
  </Button>
</div>
```

---

## チェックリスト

新機能を実装する前に、以下を確認してください:

- [ ] any 型を使用していないか
- [ ] interface ではなく type を使用しているか
- [ ] GraphQL 定義をページ内で定義していないか
- [ ] 共通化できるロジックはないか
- [ ] ファイル末尾に改行があるか
- [ ] テストは日本語で記述されているか
- [ ] プレースホルダーは具体的か
- [ ] HTTPレスポンス判定は適切か
- [ ] 固定文言をDBで管理しているか
- [ ] サイドバーにメニューを追加したか
- [ ] 関数型プログラミングのパターンに従っているか
- [ ] 関心の分離ができているか

---

## 参考資料

- [copilot-instructions.md](./copilot-instructions.md) - AI コーディングエージェント向けガイド
- [.clinerules](./.clinerules) - プロジェクト全体のルール
- [GraphQL Code Generator](https://www.the-guild.dev/graphql/codegen) - 型生成ツール

---

最終更新日: 2026-02-16
