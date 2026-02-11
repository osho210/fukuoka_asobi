# 検索エンジン公開制御機能 - テスト手順書

## 前提条件

- Node.js, npm がインストールされていること
- Ruby 3.3.1 がインストールされていること（バックエンド）
- MySQL または Docker がインストールされていること

## セットアップ

### 1. 依存関係のインストール

```bash
# ルートディレクトリで実行
npm install

# バックエンド（Dockerを使う場合はスキップ）
cd backend
bundle install
```

### 2. データベースマイグレーション

```bash
cd backend

# Dockerを使う場合
docker-compose up -d
docker exec -it fukuoka_asobi_backend bin/rails db:migrate

# ローカル環境の場合
bin/rails db:migrate
```

### 3. GraphQL型の生成

```bash
# フロントエンド
cd frontend
npm run generate

# 管理画面
cd ../admin
npm run generate
```

## テストケース

### テスト1: バックエンド - GraphQL API

#### 1-1. is_public フィールドの取得

```bash
# GraphiQL (http://localhost:3000/graphiql) で実行
query {
  playPlans(limit: 10) {
    id
    planName
    isPublic
  }
}
```

**期待結果:**
- `isPublic` フィールドが返される
- 既存データは `true` (デフォルト値)

#### 1-2. is_public の更新

```graphql
mutation {
  createOrUpdatePlayPlanWithDetails(input: {
    planName: "テストプラン"
    catchCopy: "テスト"
    subtitle: "テスト"
    leadText: "テスト"
    description: "テスト用プラン"
    departure: "博多駅"
    departureTime: "10:00"
    travelMethodToFirstSpot: "徒歩"
    travelTimeToFirstSpot: 10
    status: DRAFT
    tripType: DAY_TRIP
    totalBudget: 5000
    location: "福岡市"
    startTime: "10:00"
    endTime: "18:00"
    tags: "テスト"
    plannerTitle: "テストプランナー"
    plannerDescription: "テスト説明"
    isPublic: false  # ← 検索エンジンに非公開
    planDetails: [{
      stepNumber: 1
      stepName: "ステップ1"
      stepDescription: "テスト"
      budget: 1000
      spotId: 1
    }]
  }) {
    success
    playPlan {
      id
      planName
      isPublic
    }
    errors {
      field
      message
    }
  }
}
```

**期待結果:**
- `success: true`
- `isPublic: false` が設定される

### テスト2: 管理画面

#### 2-1. プラン新規作成画面

1. `http://localhost:9200/play_plans/new` にアクセス
2. 「公開情報」セクションを確認
3. 「検索エンジンに公開」チェックボックスがあることを確認
4. チェックボックスのデフォルトがON（チェック済み）であることを確認

**期待結果:**
- ✅ チェックボックスが表示される
- ✅ デフォルトでチェックされている

#### 2-2. プラン作成（非公開）

1. 必要な情報を入力
2. 「検索エンジンに公開」のチェックを**外す**
3. 保存

**期待結果:**
- ✅ エラーなく保存できる
- ✅ 編集画面でチェックが外れていることを確認

#### 2-3. プラン編集画面

1. `http://localhost:9200/play_plans/[id]/edit` にアクセス
2. 「検索エンジンに公開」の状態を確認
3. チェックを切り替えて保存

**期待結果:**
- ✅ 設定が保存される
- ✅ 再度編集画面を開いても状態が保持されている

#### 2-4. スポット管理画面（動的モデルページ）

1. `http://localhost:9200/spots` にアクセス
2. スポットを選択して詳細モーダルを開く
3. 「Is Public」フィールドを確認

**期待結果:**
- ✅ is_public フィールドが表示される
- ✅ チェックボックスで変更できる

### テスト3: フロントエンド - SEO メタタグ

#### 3-1. 公開プランのメタタグ確認

```bash
# is_public = true のプラン
curl -s http://localhost:8200/plans/[id] | grep -i "robots"
```

**期待結果:**
- robots メタタグが**含まれない**、または `index, follow` （検索エンジンに公開）

#### 3-2. 非公開プランのメタタグ確認

```bash
# is_public = false のプラン
curl -s http://localhost:8200/plans/[id] | grep -i "robots"
```

**期待結果:**
```html
<meta name="robots" content="noindex, nofollow"/>
```

#### 3-3. スポットページでも同様に確認

```bash
# is_public = false のスポット
curl -s http://localhost:8200/spots/[id] | grep -i "robots"
```

**期待結果:**
```html
<meta name="robots" content="noindex, nofollow"/>
```

#### 3-4. ブラウザでの確認

1. 非公開プラン/スポットのページにアクセス
2. ブラウザの開発者ツール (F12) を開く
3. Elements タブで `<head>` を確認

**期待結果:**
- `<meta name="robots" content="noindex, nofollow">` が含まれている

### テスト4: ISR キャッシュの動作確認

#### 4-1. キャッシュの確認

1. プランページにアクセス（初回）
2. 管理画面で is_public を変更
3. **60秒以内**に再度フロントエンドでアクセス → キャッシュが使われる（メタタグは変わらない）
4. **60秒後**に再度アクセス → 新しいデータで再生成される（メタタグが変わる）

**期待結果:**
- ✅ 60秒以内はキャッシュが使われる
- ✅ 60秒後は新しいデータが反映される

## トラブルシューティング

### GraphQL型が生成されない

**原因:** バックエンドが起動していない

**解決策:**
```bash
cd backend
bin/rails server
# または
docker-compose up -d
```

### フロントエンドでメタタグが表示されない

**原因1:** ビルドキャッシュ

**解決策:**
```bash
cd frontend
rm -rf .next
npm run dev
```

**原因2:** サーバーサイドレンダリングされていない

**解決策:**
- ページソースを確認（右クリック → ページのソースを表示）
- ブラウザの開発者ツールではなく、HTMLソースを確認

### 管理画面でチェックボックスが表示されない

**原因:** GraphQL型が古い

**解決策:**
```bash
cd admin
npm run generate
```

## テスト完了チェックリスト

- [ ] バックエンド GraphQL API で is_public が取得できる
- [ ] バックエンド GraphQL API で is_public が更新できる
- [ ] 管理画面のプラン新規作成でチェックボックスが表示される
- [ ] 管理画面のプラン編集でチェックボックスが表示される
- [ ] 管理画面のスポット詳細モーダルで is_public が表示される
- [ ] フロントエンドで非公開プランに `noindex, nofollow` が設定される
- [ ] フロントエンドで非公開スポットに `noindex, nofollow` が設定される
- [ ] 公開プランではrobots メタタグが正常（noindex がない）
- [ ] ISR キャッシュが60秒間有効である

## レポート形式

テスト完了後、以下の形式でレポートを作成してください:

```markdown
## テスト結果レポート

**テスト実施日**: YYYY-MM-DD
**テスト担当者**: [名前]
**環境**: [開発/ステージング/本番]

### 実施結果

| テストケース | 結果 | 備考 |
|------------|------|------|
| バックエンド - is_public取得 | ✅/❌ |  |
| バックエンド - is_public更新 | ✅/❌ |  |
| 管理画面 - プラン新規作成 | ✅/❌ |  |
| 管理画面 - プラン編集 | ✅/❌ |  |
| 管理画面 - スポット詳細 | ✅/❌ |  |
| フロントエンド - 非公開プラン | ✅/❌ |  |
| フロントエンド - 非公開スポット | ✅/❌ |  |
| フロントエンド - 公開プラン | ✅/❌ |  |
| ISR キャッシュ | ✅/❌ |  |

### 問題点・改善提案

[記載]

### 総合評価

- [ ] すべてのテストケースが合格
- [ ] 本番環境へのデプロイ準備完了
```
