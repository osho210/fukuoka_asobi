# 検索パラメータ仕様書

## 概要
本ドキュメントは、福岡遊びアプリケーションの検索機能で使用されるパラメータの仕様を定義します。

## バージョン
- 作成日: 2025-11-25
- バージョン: 1.0

---

## 1. 基本検索パラメータ

### 1.1 districts（地区）
- **型**: `Array<String|Integer>`
- **必須**: Yes
- **説明**: 検索対象の地区IDまたはslug
- **制約**:
  - 最低1つ以上の地区を指定する必要がある
  - IDと slugの両方に対応
- **例**: 
  ```json
  ["tenjin", "hakata"]
  // または
  [1, 2]
  ```

### 1.2 date（日付）
- **型**: `String`
- **必須**: Yes
- **形式**: `YYYY-MM-DD`
- **説明**: プラン実施日
- **制約**:
  - 過去の日付は指定不可
  - 現在日または未来の日付のみ有効
- **例**: `"2025-12-01"`

### 1.3 memberInfo（メンバー情報）
- **型**: `Object`
- **必須**: Yes
- **プロパティ**:
  - `recommendUsers`: `Array<Integer>` - おすすめ対象ユーザーのID配列
- **制約**:
  - 最低1つ以上のユーザーIDを指定する必要がある
- **例**:
  ```json
  {
    "recommendUsers": [1, 3]
  }
  ```

### 1.4 budget（予算）
- **型**: `Object`
- **必須**: Yes
- **プロパティ**:
  - `min`: `Number` - 最小予算（円）
  - `max`: `Number` - 最大予算（円）
- **制約**:
  - min >= 0
  - max >= 0
  - min <= max
- **例**:
  ```json
  {
    "min": 0,
    "max": 20000
  }
  ```

---

## 2. オプションパラメータ

### 2.1 startTime（開始時刻）
- **型**: `String`
- **必須**: No
- **形式**: `HH:MM`
- **デフォルト**: `"09:00"`
- **説明**: プラン開始時刻
- **制約**:
  - 24時間形式
  - endTime より前である必要がある
- **例**: `"10:00"`

### 2.2 endTime（終了時刻）
- **型**: `String`
- **必須**: No
- **形式**: `HH:MM`
- **デフォルト**: `"21:00"`
- **説明**: プラン終了時刻
- **制約**:
  - 24時間形式
  - startTime より後である必要がある
- **例**: `"18:00"`

---

## 3. カスタムオプション（customOptions）

### 3.1 基本カスタムオプション

#### 3.1.1 transportationMethod（移動手段）
- **型**: `String`
- **必須**: No
- **デフォルト**: `"car"`
- **選択肢**:
  - `"walk"` / `"徒歩"`: 徒歩
  - `"car"` / `"車"`: 車
  - `"train"` / `"電車"`: 電車
  - `"bicycle"` / `"自転車"`: 自転車
- **説明**: メインの移動手段
- **例**: `"car"`

#### 3.1.2 theme（テーマ）
- **型**: `String`
- **必須**: No
- **説明**: プランのテーマ
- **選択肢**: ThemeOptionsResolverで定義されたテーマID
- **例**: `"romantic"`

#### 3.1.3 rainyDayOption（雨天対応）
- **型**: `Boolean`
- **必須**: No
- **デフォルト**: `false`
- **説明**: 雨天でも楽しめるスポットのみを含める
- **例**: `true`

#### 3.1.4 includeEvents（イベント含む）
- **型**: `Boolean`
- **必須**: No
- **デフォルト**: `false`
- **説明**: イベントを含めるかどうか
- **例**: `true`

#### 3.1.5 startingPoint（出発地点）
- **型**: `String`
- **必須**: No
- **説明**: プランの出発地点（駅名、空港名、地域名など）
- **例**: `"博多駅"`

#### 3.1.6 spotCount（スポット数）
- **型**: `Integer`
- **必須**: No
- **デフォルト**: `3`
- **制約**:
  - 1 <= spotCount <= 10
- **説明**: 訪問するスポットの数
- **例**: `5`

#### 3.1.7 categories（カテゴリー）
- **型**: `Array<String>`
- **必須**: No
- **説明**: プランに含めるカテゴリー名の配列
- **例**: `["cafe", "museum"]`

---

### 3.2 プレミアム検索オプション（課金ユーザー専用）

> **注意**: 以下のオプションはプレミアムプランユーザーのみ利用可能です。
> 非課金ユーザーが使用した場合、エラーが返されます。

#### 3.2.1 決済手段

##### acceptsCreditCards（クレジットカード可）
- **型**: `Boolean`
- **必須**: No
- **プレミアム**: Yes
- **説明**: クレジットカード決済が可能なスポットのみ
- **例**: `true`

##### acceptsNfc（NFC決済可）
- **型**: `Boolean`
- **必須**: No
- **プレミアム**: Yes
- **説明**: NFC決済（非接触決済）が可能なスポットのみ
- **例**: `true`

##### acceptsCashOnly（現金のみ）
- **型**: `Boolean`
- **必須**: No
- **プレミアム**: Yes
- **説明**: 現金のみ受け付けるスポット
- **例**: `true`

#### 3.2.2 飲食店オプション

##### servesBreakfast（朝食提供）
- **型**: `Boolean`
- **必須**: No
- **プレミアム**: Yes
- **説明**: 朝食を提供している飲食店のみ
- **例**: `true`

##### servesLunch（ランチ提供）
- **型**: `Boolean`
- **必須**: No
- **プレミアム**: Yes
- **説明**: ランチを提供している飲食店のみ
- **例**: `true`

##### servesDinner（ディナー提供）
- **型**: `Boolean`
- **必須**: No
- **プレミアム**: Yes
- **説明**: ディナーを提供している飲食店のみ
- **例**: `true`

##### servesVegetarianFood（ベジタリアン対応）
- **型**: `Boolean`
- **必須**: No
- **プレミアム**: Yes
- **説明**: ベジタリアン料理を提供している飲食店のみ
- **例**: `true`

##### outdoorSeating（屋外席あり）
- **型**: `Boolean`
- **必須**: No
- **プレミアム**: Yes
- **説明**: 屋外席がある飲食店のみ
- **例**: `true`

##### goodForChildren（子供連れ歓迎）
- **型**: `Boolean`
- **必須**: No
- **プレミアム**: Yes
- **説明**: 子供連れに適したスポットのみ
- **例**: `true`

##### allowsDogs（ペット可）
- **型**: `Boolean`
- **必須**: No
- **プレミアム**: Yes
- **説明**: ペット（犬）同伴可能なスポットのみ
- **例**: `true`

#### 3.2.3 その他のオプション

##### reservable（予約可能）
- **型**: `Boolean`
- **必須**: No
- **プレミアム**: Yes
- **説明**: 予約が可能なスポットのみ
- **例**: `true`

##### takeout（テイクアウト可）
- **型**: `Boolean`
- **必須**: No
- **プレミアム**: Yes
- **説明**: テイクアウトが可能なスポットのみ
- **例**: `true`

##### delivery（デリバリー可）
- **型**: `Boolean`
- **必須**: No
- **プレミアム**: Yes
- **説明**: デリバリーが可能なスポットのみ
- **例**: `true`

---

## 4. レスポンス

### 4.1 成功時

```json
{
  "plan": {
    "id": "1",
    "planName": "天神でロマンチックプラン",
    "description": "2025年12月01日の天神でロマンチックプランです。",
    "startDatetime": "2025-12-01T10:00:00+09:00",
    "endDatetime": "2025-12-01T18:00:00+09:00",
    "totalBudget": 24000,
    "planDetails": [...]
  },
  "errors": []
}
```

### 4.2 エラー時

#### バリデーションエラー
```json
{
  "plan": null,
  "errors": [
    "date: 過去の日付は指定できません",
    "districts: エリアを選択してください"
  ]
}
```

#### プレミアム機能エラー
```json
{
  "plan": null,
  "errors": [
    "この検索条件はプレミアムプランでのみ利用可能です"
  ]
}
```

#### スポット不足エラー
```json
{
  "plan": null,
  "errors": [
    "条件に合うスポットが不足しています。条件を緩和して再検索してください。"
  ]
}
```

---

## 5. 使用例

### 5.1 基本的な検索

```graphql
mutation {
  generatePlan(
    districts: ["tenjin"]
    date: "2025-12-01"
    memberInfo: { recommendUsers: [1] }
    budget: { min: 0, max: 20000 }
  ) {
    plan {
      id
      planName
    }
    errors
  }
}
```

### 5.2 カスタムオプション付き検索

```graphql
mutation {
  generatePlan(
    districts: ["tenjin", "hakata"]
    date: "2025-12-01"
    memberInfo: { recommendUsers: [1, 3] }
    budget: { min: 5000, max: 30000 }
    startTime: "10:00"
    endTime: "18:00"
    customOptions: {
      transportationMethod: "train"
      theme: "romantic"
      rainyDayOption: true
      spotCount: 4
      categories: ["cafe", "restaurant"]
    }
  ) {
    plan {
      id
      planName
      planDetails {
        stepName
        budget
      }
    }
    errors
  }
}
```

### 5.3 プレミアムオプション付き検索

```graphql
mutation {
  generatePlan(
    districts: ["tenjin"]
    date: "2025-12-01"
    memberInfo: { recommendUsers: [1] }
    budget: { min: 0, max: 20000 }
    customOptions: {
      acceptsCreditCards: true
      servesVegetarianFood: true
      goodForChildren: true
      reservable: true
    }
  ) {
    plan {
      id
      planName
    }
    errors
  }
}
```

---

## 6. バリデーションルール

### 6.1 フロントエンドバリデーション
- 日付: 現在日以降のみ許可
- 地区: 最低1つ選択必須
- メンバー: 最低1つ選択必須
- 予算: min <= max
- 時刻: startTime < endTime

### 6.2 バックエンドバリデーション
- 全フロントエンドバリデーションを再実施
- 地区IDの存在確認
- プレミアム機能の権限チェック
- データ型の厳密なチェック

---

## 7. 注意事項

1. **タイムゾーン**: すべての時刻はJST（日本標準時、UTC+9）として扱われます
2. **プレミアム機能**: プレミアムオプションは課金ユーザーのみ利用可能です
3. **スポット数**: 検索条件によっては、指定したスポット数が確保できない場合があります
4. **移動手段**: 移動手段は日本語と英語の両方に対応していますが、内部では日本語に統一されます

---

## 8. 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2025-11-25 | 1.0 | 初版作成、プレミアム検索オプション追加 |
