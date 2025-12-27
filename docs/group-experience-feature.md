# グループ体験機能

## 概要
福岡での「日常」を少しだけ特別に感じられる **遊び心のあるグループ体験機能** です。  
本機能は **無料機能** とし、友達同士で遊びを決める際の「認識合わせ」と「会話のきっかけ」を提供することを目的としています。

## 機能説明

### フェーズ1: 方向性カード
- **目的**: 空気を揃える、否定を先に出せる状態を作る
- **仕様**:
  - 表示は常にカード1枚
  - 1〜2行の短文で表示
  - 地名・店名は含めない
  - YES / NO で即答できる
- **挙動**:
  - 最大3枚まで表示
  - 合意は取らない（方向が見えればOK）

### フェーズ2: 体験カード選択
- **目的**: フェーズ1で揃えた方向性に合う具体的体験を提示する
- **仕様**:
  - 体験カード候補を3〜5枚表示
  - タイトル＋本文（本文は2〜3行で省略）
  - 優劣をつけない（ランキング・スコアなし）
- **操作**:
  - 「これにする」
  - 「また今度（保留）」
  - 共有機能

## ルート構成

```
/group-experience           # 開始画面
/group-experience/direction # フェーズ1: 方向性カード
/group-experience/experience # フェーズ2: 体験カード
```

## データモデル

### DirectionCard（方向性カード）
```ruby
- id: integer
- text: text (必須, 最大200文字)
- tags: string (カンマ区切り)
- weight: integer (デフォルト1, 表示確率に影響)
- active: boolean (デフォルトtrue)
- created_at: datetime
- updated_at: datetime
```

### ExperienceCard（体験カード）
```ruby
- id: integer
- title: string (必須, 最大100文字)
- body: text (最大500文字)
- tags: string (カンマ区切り)
- area: string (エリア名, 任意)
- duration: integer (所要時間（分）, 任意)
- time_slot: string (時間帯, 任意)
- active: boolean (デフォルトtrue)
- created_at: datetime
- updated_at: datetime
```

## GraphQL API

### クエリ

#### directionCards
```graphql
query GetDirectionCards($limit: Int) {
  directionCards(limit: $limit) {
    id
    text
    tags
    weight
    active
  }
}
```

#### experienceCards
```graphql
query GetExperienceCards($tags: [String!], $limit: Int, $excludeIds: [ID!]) {
  experienceCards(tags: $tags, limit: $limit, excludeIds: $excludeIds) {
    id
    title
    body
    truncatedBody(length: 100)
    tags
    area
    duration
    timeSlot
    active
  }
}
```

## マッチングロジック

1. フェーズ1で選ばれたタグを収集
2. タグ一致数でソート
3. ランダム要素を加えて多様性を確保
4. 最大5件を返す

## セキュリティ

- CodeQL スキャン: ✅ 問題なし
- SQL インジェクション対策: パラメータバインディング使用
- XSS 対策: React のデフォルトエスケープ機能使用

## テスト

### バックエンド (RSpec)
- `spec/models/direction_card_spec.rb`
- `spec/models/experience_card_spec.rb`
- `spec/factories/direction_cards.rb`
- `spec/factories/experience_cards.rb`

### カバレッジ
- モデルのバリデーション
- スコープ機能
- タグ配列の変換
- 本文省略機能

## シードデータ

### 方向性カード
- 12件のサンプルデータ
- 例: 「今日は「静かめ」な時間がいい」「観光っぽくない福岡にしたい」など

### 体験カード
- 20件のサンプルデータ
- 福岡の様々な体験を網羅
- 例: 「大濠公園でのんびり散歩」「博多の屋台で夜ごはん」など

## 実装ファイル

### バックエンド
- `backend/db/migrate/20251227105614_create_direction_cards.rb`
- `backend/db/migrate/20251227105615_create_experience_cards.rb`
- `backend/app/models/direction_card.rb`
- `backend/app/models/experience_card.rb`
- `backend/app/graphql/types/direction_card_type.rb`
- `backend/app/graphql/types/experience_card_type.rb`
- `backend/app/graphql/types/query_type.rb` (クエリ追加)
- `backend/db/seeds/direction_cards.rb`
- `backend/db/seeds/experience_cards.rb`

### フロントエンド
- `frontend/src/app/group-experience/page.tsx`
- `frontend/src/app/group-experience/direction/page.tsx`
- `frontend/src/app/group-experience/experience/page.tsx`
- `frontend/src/graphql/queries/getDirectionCards.ts`
- `frontend/src/graphql/queries/getExperienceCards.ts`
- `frontend/src/components/HamburgerMenu.tsx` (ナビゲーション追加)
- `frontend/src/app/page.tsx` (プロモーション追加)

## デプロイ手順

1. マイグレーションの実行
```bash
cd backend
bin/rails db:migrate
```

2. シードデータの投入
```bash
bin/rails db:seed
```

3. フロントエンドのビルド
```bash
npm run build:frontend
```

## 今後の拡張可能性

- 詳細なプラン作成機能への導線（有料機能）
- ユーザーの選択履歴に基づくレコメンデーション
- グループでの共同選択機能
- SNS連携強化

## 注意事項

- この機能は無料で提供されます
- 決まらなくても問題ありません（会話のきっかけが目的）
- 情報量は常に最小限に保っています
