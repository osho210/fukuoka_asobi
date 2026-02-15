# GitHub Copilot 開発ガイド

このドキュメントでは、福岡遊び日記プロジェクトで GitHub Copilot を使用する際の指針をまとめています。

## 📚 プロジェクト概要

**サービス名**: 福岡遊び日記（Fukuoka Asobi）

**目的**: 福岡のローカルな遊び場所を探し、失敗しないプランを自動提案するサービス

**ターゲットユーザー**:
- 20代前半〜後半の男性（デートプランを求める層）
- 20代後半〜30代前半の女性（ディープなスポットを求める層）

## 🏗 プロジェクト構成

モノレポ構造（npm workspaces）で管理：

```
fukuoka-asobi/
├── backend/     # Ruby on Rails + GraphQL API
├── frontend/    # Next.js ユーザー向けサイト
└── admin/       # Next.js 管理画面
```

## 💻 コア技術

| 技術 | 用途 |
|------|------|
| Ruby on Rails | バックエンド API |
| GraphQL | API インターフェース |
| Next.js 15.x | フロントエンド・管理画面 |
| TypeScript | 型安全性の確保 |
| Apollo Client | GraphQL クライアント |
| PostgreSQL | 本番 DB |
| MySQL 8.0 | 開発 DB |

## 🚀 スキーマ駆動開発フロー

このプロジェクトは GraphQL スキーマを真実の源泉として、自動的に型定義を生成します。

### フロー図

```
1. バックエンドでスキーマを変更
   ↓
2. Rails サーバーを再起動
   ↓
3. npm run generate を実行
   ↓
4. フロントエンドで自動生成された型を使用
```

### 実行例

```bash
# 1. バックエンドのスキーマを編集
# backend/app/graphql/types/ 内のファイルを編集

# 2. Rails サーバー起動
cd backend && rails server

# 3. フロントエンド側で型定義を再生成
cd frontend
npm run generate

# または
npm run generate -w frontend
```

### ✅ 推奨される実装パターン

```typescript
// ✅ DO: 自動生成された型を使用
import { GetSpotsQuery } from '@/__generated__/types';
import { useQuery } from '@apollo/client';
import { GET_SPOTS } from '@/graphql/queries/getSpots';

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

### ❌ 避けるべきパターン

```typescript
// ❌ DON'T: 手動で型定義を作成
interface Spot {
  id: string;
  spotName: string;
}

// ❌ DON'T: any 型を使用
const { data } = useQuery<any>(GET_SPOTS);

// ❌ DON'T: 自動生成ファイルを手動編集
// __generated__ 内のファイルは自動生成されます
```

## 📦 npm Workspaces ガイド

### 共通ライブラリ（ルートレベル）

全ワークスペースで共有される主要ライブラリ：

```
react, next.js, apollo-client, graphql, typescript, eslint
```

### ワークスペース固有のライブラリ

**frontend 専用**:
- axios, date-fns, react-slick, swiper

**admin 専用**:
- @radix-ui/*, react-hook-form, zod, lucide-react

### よく使うコマンド

```bash
# 依存関係をインストール
npm install

# 特定のワークスペースにパッケージを追加
npm install <package-name> -w frontend
npm install <package-name> -w admin

# 開発サーバー起動
npm run dev:frontend      # ポート 8200
npm run dev:admin         # ポート 9200

# GraphQL 型定義を生成
npm run generate -w frontend
npm run generate -w admin

# ビルド
npm run build:frontend
npm run build:admin

# リント
npm run lint:frontend
npm run lint:admin

# テスト実行
npm test -w frontend
npm test -w admin

# 全ワークスペースでコマンド実行
npm run build --workspaces
```

## 🎨 コーディング規約

### バックエンド（Ruby）

```ruby
# ✅ RuboCop準拠（Ruby Style Guide, 自動整形対応）
# ✅ Google スタイルの Docstring

class SpotService
  # スポットのお気に入り判定を実行します。
  #
  # Args:
  #   user_id (Integer): ユーザーID
  #   spot_id (Integer): スポットID
  #
  # Returns:
  #   Boolean: お気に入り登録されている場合は true
  def is_favorite?(user_id, spot_id)
    Favorite.exists?(user_id: user_id, spot_id: spot_id)
  end
end
```

### フロントエンド（TypeScript）

```typescript
// ✅ ESLint + Prettier 準拠
// ✅ TypeScript strict mode
// ✅ コンポーネント命名：PascalCase
// ✅ 関数・変数命名：camelCase

interface SpotCardProps {
  spotName: string;
  address: string;
  imageUrl?: string;
}

export function SpotCard({ spotName, address, imageUrl }: SpotCardProps) {
  return (
    <div className="spot-card">
      {imageUrl && <img src={imageUrl} alt={spotName} />}
      <h3>{spotName}</h3>
      <p>{address}</p>
    </div>
  );
}
```

## 🧪 テスト戦略

### バックエンド（RSpec）

```bash
# テスト実行
cd backend && rspec

# テストカバレッジ確認
rspec --format coverage

# 特定のテストファイル実行
rspec spec/models/spot_spec.rb

# テストファイルの配置
# spec/
# ├── models/
# ├── services/
# └── graphql/
```

### フロントエンド（Vitest）

```bash
# テスト実行
npm test -w frontend

# 監視モード
npm test -- --watch -w frontend

# カバレッジ確認
npm test -- --coverage -w frontend

# テストファイルの配置
# src/components/tests/[ComponentName].test.tsx
# src/lib/tests/[utilityName].test.ts
```

## 🗂 データベース構造の要点

### 主要テーブル

| テーブル | 説明 |
|---------|------|
| `users` | ユーザー情報（Google OAuth） |
| `spots` | スポット（カフェ、レストラン等） |
| `play_plans` | ユーザーが作成した遊びプラン |
| `plan_details` | プラン内の各ステップ |
| `events` | イベント情報 |
| `news` | ニュース・記事 |
| `bookmarks` | ユーザーのブックマーク |
| `favorites` | ユーザーのお気に入り |

詳細は `.clinerules` の DB 設計セクションを参照してください。

## ⚙️ セットアップ手順

### 初回セットアップ

```bash
# リポジトリをクローン
git clone git@github.com:osho210/fukuoka_asobi.git
cd fukuoka-asobi

# 依存関係をインストール
npm install

# バックエンド環境設定
cd backend
bundle install
rails db:setup
rails server

# フロントエンド開発サーバー起動（別ターミナル）
cd frontend
npm run dev

# http://localhost:8200 にアクセス
```

### Docker で実行

```bash
docker-compose up
# バックエンド: http://localhost:3000
# MySQL: localhost:3306
```

## 🔄 日本語レビュー指針

このプロジェクトでは、すべてのレビューコメントを日本語で記述します。

### コードレビュー時のガイドライン

```markdown
# ✅ 良い例

- このコンポーネントの責任が大きすぎます。分割を検討してください
- GraphQL のクエリをメモ化することでパフォーマンスが向上します
- このテーブルの N+1 問題を解決するために eager_load を使用しましょう
```

```markdown
# ❌ 避けるべき例

- "this is inefficient"
- "missing types"
- "refactor this"

# ✅ 改善案

- 「このクエリはまとめることで API 呼び出し回数を削減できます」
- 「この変数に型注釈を追加してください」
- 「このコンポーネントを小さな部品に分割してみてください」
```

### PR レビュー時のチェックポイント

#### バックエンド（Rails）

- [ ] 新しい GraphQL 型には Docstring が記述されているか
- [ ] RuboCop による自動チェックを通っているか
- [ ] テストカバレッジが十分か（目安: 80% 以上）
- [ ] N+1 クエリの問題はないか
- [ ] 適切なバリデーションが実装されているか

#### フロントエンド（Next.js）

- [ ] TypeScript の型がすべて定義されているか
- [ ] 自動生成された GraphQL 型を使用しているか（手動型定義はないか）
- [ ] コンポーネントが過度に複雑ではないか（一つの責務に）
- [ ] ESLint のエラーはないか
- [ ] テストが追加されているか

#### 共通

- [ ] コメント・変数名・関数名は日本語で説明されているか
- [ ] ドキュメントが更新されているか（必要な場合）
- [ ] コミットメッセージは明確か

## 🐛 トラブルシューティング

### GraphQL 型生成が失敗する場合

```bash
# 1. バックエンドが起動しているか確認
curl http://localhost:3000/graphql

# 2. GraphQL キャッシュをクリア
rm -rf frontend/src/__generated__
rm -rf admin/src/__generated__

# 3. 型定義を再生成
npm run generate -w frontend
npm run generate -w admin
```

### ワークスペース依存関係の問題

```bash
# キャッシュをクリアして再インストール
rm -rf node_modules package-lock.json
npm install

# 特定のワークスペースの問題
rm -rf frontend/node_modules
npm install -w frontend
```

### TypeScript エラー

```bash
# IDE のキャッシュをリセット
# - VSCode: Ctrl+Shift+P > TypeScript: Restart TS Server
# または
rm -rf node_modules/.typescript
npm install
```

### ポート競合

```bash
# ポート 8200 で実行中のプロセスを確認
lsof -i :8200

# プロセスを終了
kill -9 <PID>
```

## 📖 参考資料

- [GraphQL Code Generator ガイド](./docs/GRAPHQL_CODEGEN.md)
- [GraphQL 型使用ガイド](./docs/GRAPHQL_TYPES_GUIDE.md)
- [npm Workspaces ガイド](./docs/workspace_guide.md)
- [全体設計書](./docs/design.md)
- [..clinerules](./.clinerules) - Cline AI 用の詳細ガイド
- [.github/copilot-instructions.md](./.github/copilot-instructions.md) - GitHub Copilot テンプレート

## 🎯 実装時のチェックリスト

新しい機能を実装する際は、以下を確認してください：

- [ ] バックエンドで GraphQL スキーマを定義した
- [ ] バックエンドのテストを記述した
- [ ] `npm run generate` で型定義を生成した
- [ ] フロントエンドで自動生成された型を使用した
- [ ] コンポーネントテストを記述した
- [ ] ESLint、RuboCop でチェックを通した
- [ ] ドキュメントを更新した（必要な場合）
- [ ] レビュー用コメントはすべて日本語である

## 💡 よくある質問

### Q: GraphQL クエリを手動で型定義してもいい？

**A**: いいえ。常に自動生成された型を使用してください。スキーマ変更時に型定義を再生成することで、型と実装の整合性が保証されます。

### Q: 日本語コメントはコード内に必要？

**A**: はい。複雑なロジックや重要なビジネスロジックには、日本語コメントを追加してください。ただし、変数名・関数名・クラス名は英語のままです。

```typescript
// ✅ 良い例
// 福岡市内のスポットのみをフィルタリング
const fukuokaSpots = spots.filter(spot => spot.district.id === 1);

// ❌ 避けるべき例
// フィルタリング
const fukuokaSpots = spots.filter(spot => spot.district.id === 1);
```

### Q: ワークスペース間で依存関係を共有したい場合は？

**A**: ルートレベルの `package.json` に追加します。特定のワークスペースだけで使用する場合は、そのワークスペースの `package.json` に追加してください。

---

## 💡 重要な実装パターン

### GraphQL Mutation の引数定義

GraphQL の mutation では、input オブジェクトではなく個別の引数として定義してください。

```ruby
# ✅ DO: 個別の引数として定義
class CreateConsentAgreement < BaseMutation
  argument :token, String, required: true
  argument :signer_name, String, required: true
  argument :rights_confirmed, Boolean, required: true
  argument :signer_instagram, String, required: false
  
  def resolve(token:, signer_name:, rights_confirmed:, signer_instagram: nil)
    # 実装
  end
end

# ❌ DON'T: input オブジェクトを使用
class CreateConsentAgreement < BaseMutation
  argument :input, Types::Input::ConsentAgreementInput, required: true
  
  def resolve(input:)
    # 実装
  end
end
```

### RSpec テストの記述

テストケースは日本語で記述し、全体条件がある場合は describe/context で分割してください。

```ruby
# ✅ DO: 日本語でcontext/describeを使用
describe '#expired?' do
  context '有効期限が過去の場合' do
    it 'trueを返すこと' do
      # テスト実装
    end
  end
  
  context '有効期限が未来の場合' do
    it 'falseを返すこと' do
      # テスト実装
    end
  end
end

# ❌ DON'T: 英語のテスト説明
describe '#expired?' do
  it 'returns true if expires_at is in the past' do
    # テスト実装
  end
end
```

### 共通ユーティリティ関数の配置

複数のコンポーネントで使用する関数は、`src/lib/` 配下に共通ユーティリティとして切り出してください。

```typescript
// ✅ DO: 共通関数として切り出し
// src/lib/consentUtils.ts
export const renderConsentRequestStatusIcon = (status: string) => {
  // 実装
};

// src/app/consent_requests/page.tsx
import { renderConsentRequestStatusIcon } from '@/lib/consentUtils';

// ❌ DON'T: コンポーネント内で直接定義
export default function ConsentRequestsPage() {
  const getStatusIcon = (status: string) => {
    // 実装
  };
}
```

### 数値型の扱い

GraphQL の ID 型は文字列として扱われるため、parseInt は不要です。

```typescript
// ✅ DO: そのまま渡す
await createConsentRequest({
  variables: {
    spotId: formData.spotId,  // すでに適切な型
  },
});

// ❌ DON'T: 不要な parseInt
await createConsentRequest({
  variables: {
    spotId: parseInt(formData.spotId),
  },
});
```

### プレースホルダーの具体性

ユーザーが入力すべき内容を具体的に示すプレースホルダーを使用してください。

```typescript
// ✅ DO: 具体的な例を示す
placeholder={formData.consenterType === 'INSTAGRAM_USER' 
  ? '例: @fukuoka_cafe_lover' 
  : '例: 店長 田中'}

// ❌ DON'T: 一般的すぎる例
placeholder="例: @username"
```

---

## 📋 機能追加時のチェックリスト

新機能を追加する際は、以下を確認してください：

- [ ] GraphQL mutation は個別引数で定義されているか
- [ ] RSpec テストは日本語で記述されているか
- [ ] 共通関数は適切に切り出されているか
- [ ] プレースホルダーは具体的で分かりやすいか
- [ ] 型の自動生成を活用しているか（手動定義していないか）

---

## 📝 将来の改善項目（別 Issue として管理）

以下の項目は、本プロジェクトの継続的改善として別 Issue で管理します：

1. **コンポーネントのエクスポート統一**
   - 各コンポーネントを個別 import するのではなく、統一されたエクスポートファイルから import する

2. **成功/エラー通知のデザインパターン統一**
   - 成功時: トースト通知
   - エラー時: モーダル（ダイアログ）
   - 既存実装の調査とドキュメント化が必要

3. **DM テンプレートのバージョン管理**
   - テンプレート文をデータベースで管理
   - バージョン管理機能の実装

---

## 🔒 コードレビュー時の共通パターン（重要）

### GraphQL Mutation の引数定義

**DO**: Input オブジェクトを使用する

```ruby
# backend/app/graphql/mutations/create_example.rb
argument :input, Types::Input::ExampleInput, required: true

def resolve(input:)
  # 実装
end
```

**DON'T**: 個別引数を列挙しない

```ruby
# ❌ 避けるべき
argument :field1, String, required: true
argument :field2, String, required: true
# ...
```

### RSpec テストの記述パターン

**DO**: 日本語で記述し、context/describe で条件を構造化する

```ruby
describe '#expired?' do
  context '有効期限が過去の場合' do
    it 'trueを返すこと' do
      # テスト実装
    end
  end

  context '有効期限が未来の場合' do
    it 'falseを返すこと' do
      # テスト実装
    end
  end
end
```

### 共通ユーティリティ関数の配置

**DO**: 機能ごとに lib ディレクトリに配置する

```
admin/src/lib/
├── clipboardUtils.ts    # クリップボード操作
├── consentUtils.ts      # 承諾管理関連
└── formatUtils.ts       # フォーマット関数
```

**使用例**:
```typescript
import { copyToClipboard } from '@/lib/clipboardUtils';

const handleCopy = async () => {
  const success = await copyToClipboard(text);
  if (success) {
    // 成功時の処理
  }
};
```

### TypeScript の型定義

**DO**: any 型を使用せず、明示的に型定義する

```typescript
// GraphQL レスポンスの型定義
interface ConsentRequest {
  id: string;
  spotId: string;
  consentAgreement: ConsentAgreement | null;
}

const { data } = useQuery<GetConsentRequestsData>(GET_CONSENT_REQUESTS);
```

**DON'T**: any 型を使用しない（禁止）

```typescript
// ❌ 絶対に避けるべき
const selectedConsent = data?.items?.find((req: any) => req.id === id);
```

### GraphQL 定義の配置

**DO**: ページから分離し、graphql ディレクトリに配置する

```
admin/src/graphql/
├── queries/
│   └── consents.ts
└── mutations/
    └── consents.ts
```

**DON'T**: ページファイル内でクエリを直接定義しない

```typescript
// ❌ 避けるべき
// page.tsx 内で直接定義
const GET_DATA = gql`
  query GetData { ... }
`;
```

### HTTP レスポンスの成功判定

**DO**: レスポンスオブジェクトの存在で判定する

```typescript
const [mutation] = useMutation(MUTATION, {
  onCompleted: (data) => {
    if (data?.createItem?.item) {
      // 成功時の処理
    } else if (data?.createItem?.errors) {
      // エラー時の処理
    }
  },
});
```

**DON'T**: エラー配列の長さだけで判定しない

```typescript
// ❌ 避けるべき
if (data.createItem.errors.length === 0) {
  // 成功
}
```

### アイコンのインポート命名

**DO**: 明確でわかりやすい名前を使用する

```typescript
import { CheckCircle2 as CheckCircleIcon } from 'lucide-react';
```

**DON'T**: 数値が含まれる名前をそのまま使わない

```typescript
// ❌ 避けるべき
import { CheckCircle2 } from 'lucide-react';
```

