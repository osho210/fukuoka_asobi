# JSON-LD 構造化データ実装完了報告

## 概要

Google リッチリザルト表示を目的とした JSON-LD 構造化データの実装が完了しました。

## 実装対象ページと対応スキーマ

| ページ | スキーマ | ファイル | 統合先 |
|--------|---------|---------|-------|
| イベント詳細 (`/events/[id]`) | Event | `EventStructuredData.tsx` | `EventDetailAdapter.tsx` |
| スポット詳細 (`/spots/[id]`) | LocalBusiness | `LocalBusinessStructuredData.tsx` | `SpotDetailAdapter.tsx` |
| プラン詳細 (`/plans/[id]`) | Article | `ArticleStructuredData.tsx` | `PlayPlanDetail.tsx` |

## 実装された構造化データの詳細

### 1. Event Schema

イベント詳細ページに以下の情報を含む JSON-LD を追加：

- **基本情報**: イベント名、説明
- **日時情報**: 開始日時、終了日時
- **ステータス**: 開催予定 / 中止
- **参加方法**: オンライン / オフライン
- **会場情報**: 
  - オフライン: 会場名、住所、緯度経度
  - オンライン: URL
- **主催者情報**: 組織名、連絡先（メール、電話）
- **料金情報**: 価格、通貨（JPY）、有効期限
- **画像**: バナー画像

### 2. LocalBusiness Schema

スポット詳細ページに以下の情報を含む JSON-LD を追加：

- **基本情報**: ビジネス名、説明、画像
- **住所情報**: 
  - 住所、地区名（動的取得）
  - 都道府県、国
  - 緯度経度
- **連絡先**: 電話番号、ウェブサイトURL
- **営業時間**: 曜日別の開店・閉店時刻
- **評価**: 評価値、レビュー数
- **料金**: 料金帯（範囲またはテキスト）
- **カテゴリー**: 料理ジャンル等
- **サービス**: 予約可否、支払い方法

### 3. Article Schema

プラン詳細ページに以下の情報を含む JSON-LD を追加：

- **基本情報**: 記事タイトル（プラン名）、説明、画像
- **日時情報**: 公開日時、更新日時
- **著者情報**: 著者名、アバター画像
- **パブリッシャー**: 
  - サイト名（福岡遊び日記）
  - ロゴ画像
- **ページURL**: 正規URL

## 技術的な実装ポイント

### 1. 型安全性の確保

GraphQL の自動生成型を活用して TypeScript の型安全性を保証：

```typescript
import { Event, StatusEnum } from '@/__generated__/graphql';
import { Spot } from '@/__generated__/graphql';
import { PlayPlan } from '@/__generated__/graphql';
```

### 2. コードの再利用性

共通のユーティリティ関数を作成してコードの重複を削減：

```typescript
// frontend/src/lib/structuredDataUtils.ts
export function removeUndefinedValues<T>(data: T): T {
  // undefined 値を自動的に除去
}
```

### 3. schema.org 準拠

- Boolean 値は文字列ではなく `true`/`false` を使用
- 日付は ISO 8601 形式を使用
- URL は完全修飾URL（FQDN）を使用

### 4. 動的データ対応

- 地区名は `spot.district?.districtName` から動的に取得
- 画像は複数ソースからのフォールバック処理
- 営業時間は休業日を自動フィルタリング

## 品質保証

### コード品質

✅ **TypeScript 型チェック**: エラーなし  
✅ **ESLint**: 警告・エラーなし  
✅ **コードレビュー**: 3件の指摘に全て対応
- 共通ユーティリティ関数への抽出
- schema.org 仕様への準拠（acceptsReservations）
- 動的データ取得（addressLocality）

### セキュリティ

✅ **CodeQL スキャン**: アラートなし  
✅ **XSS対策**: `dangerouslySetInnerHTML` は JSON.stringify で安全にエスケープ  
✅ **データバリデーション**: undefined 値の適切な処理

## 検証方法

### 1. ローカル環境での確認

```bash
# 開発サーバーを起動
npm run dev:frontend

# ブラウザでページにアクセスし、ソースを表示
# <script type="application/ld+json"> タグを確認
```

### 2. 自動検証スクリプト

```bash
cd frontend
npx tsx src/components/StructuredData/validate-jsonld.ts
```

### 3. Google Rich Results Test

本番環境デプロイ後：
1. [Google Rich Results Test](https://search.google.com/test/rich-results) にアクセス
2. ページURLを入力してテスト
3. エラーや警告がないか確認

### 4. Schema.org Validator

[Schema.org Validator](https://validator.schema.org/) で JSON-LD を検証

## ファイル構成

```
frontend/src/
├── components/
│   ├── StructuredData/
│   │   ├── EventStructuredData.tsx          # Event スキーマ
│   │   ├── LocalBusinessStructuredData.tsx  # LocalBusiness スキーマ
│   │   ├── ArticleStructuredData.tsx        # Article スキーマ
│   │   ├── index.ts                         # エクスポート
│   │   ├── README.md                        # 実装ガイド
│   │   └── validate-jsonld.ts               # 検証スクリプト
│   ├── adapters/
│   │   ├── EventDetailAdapter.tsx           # Event 統合
│   │   └── SpotDetailAdapter.tsx            # LocalBusiness 統合
│   └── PlayPlanDetail.tsx                   # Article 統合
└── lib/
    └── structuredDataUtils.ts               # 共通ユーティリティ
```

## デプロイ後の確認事項

- [ ] 各ページで `<script type="application/ld+json">` タグが正しく出力されているか
- [ ] Google Rich Results Test でエラーがないか
- [ ] Google Search Console でリッチリザルトが認識されているか
- [ ] 検索結果でリッチリザルトが表示されているか（数週間後）

## メンテナンス

### 定期的な確認

- Google の構造化データガイドライン変更時
- GraphQL スキーマに新しいフィールドが追加された時
- 新しいスキーマタイプを追加する時

### 更新手順

1. 対応するコンポーネントを編集
2. TypeScript 型チェックを実行
3. ESLint を実行
4. 検証スクリプトを実行
5. Google Rich Results Test で検証

## 参考リンク

- [Schema.org - Event](https://schema.org/Event)
- [Schema.org - LocalBusiness](https://schema.org/LocalBusiness)
- [Schema.org - Article](https://schema.org/Article)
- [Google Search Central - 構造化データ](https://developers.google.com/search/docs/appearance/structured-data)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

## まとめ

JSON-LD 構造化データの実装により、以下の効果が期待できます：

1. **検索エンジン最適化**: Google 検索結果でリッチリザルト表示
2. **クリック率向上**: 視覚的に目立つ検索結果表示
3. **情報の正確な伝達**: イベント日時、場所、評価などを検索結果に表示
4. **SEO 強化**: 構造化データによる検索エンジンへの明確な情報提供

実装は完了し、全ての品質チェックに合格しています。本番環境へのデプロイ準備が整いました。
