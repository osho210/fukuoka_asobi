# JSON-LD 構造化データ実装ガイド

## 概要

このディレクトリには、Google Rich Results（リッチリザルト）表示のための JSON-LD 構造化データコンポーネントが含まれています。

## 実装されているスキーマ

### 1. Event Schema
**ファイル**: `EventStructuredData.tsx`  
**使用場所**: イベント詳細ページ (`/events/[id]`)

#### 含まれる情報
- イベント名、説明
- 開催日時（開始・終了）
- イベントステータス（開催予定・中止など）
- 参加方法（オンライン・オフライン）
- 会場情報（名称、住所、位置情報）
- 主催者情報
- 料金情報
- 画像

### 2. LocalBusiness Schema
**ファイル**: `LocalBusinessStructuredData.tsx`  
**使用場所**: スポット詳細ページ (`/spots/[id]`)

#### 含まれる情報
- ビジネス名、説明
- 住所、位置情報
- 連絡先（電話番号、ウェブサイト）
- 営業時間
- 料金帯
- 評価・レビュー数
- カテゴリー
- 支払い方法
- 予約可否

### 3. Article Schema
**ファイル**: `ArticleStructuredData.tsx`  
**使用場所**: プラン詳細ページ (`/plans/[id]`)

#### 含まれる情報
- 記事タイトル、説明
- 公開日時、更新日時
- 著者情報
- パブリッシャー情報
- メイン画像
- ページURL

## 使用方法

各コンポーネントは、対応するアダプターまたはページコンポーネントに既に統合されています：

```tsx
import { EventStructuredData } from '@/components/StructuredData';

// イベントデータを渡すだけで自動的にJSON-LDを生成
<EventStructuredData event={eventData} />
```

## 検証方法

### 1. ローカルでの確認

```bash
# 開発サーバーを起動
npm run dev:frontend

# ブラウザで以下のURLにアクセス
# - http://localhost:8200/events/[id]
# - http://localhost:8200/spots/[id]
# - http://localhost:8200/plans/[id]

# ページのソースを表示して、<script type="application/ld+json"> タグを確認
```

### 2. Google Rich Results Test

1. [Google Rich Results Test](https://search.google.com/test/rich-results) にアクセス
2. 公開されたページのURLを入力、またはHTMLコードを貼り付け
3. 「テストを実行」ボタンをクリック
4. エラーや警告がないか確認

### 3. Schema.org Validator

1. [Schema.org Validator](https://validator.schema.org/) にアクセス
2. JSON-LDコードを貼り付け
3. バリデーション結果を確認

### 4. プログラムでの検証

```bash
cd frontend
npx tsx src/components/StructuredData/validate-jsonld.ts
```

## トラブルシューティング

### JSON-LD が表示されない

- コンポーネントが正しくインポートされているか確認
- データが正しく渡されているか確認（null や undefined でないか）

### Google Rich Results でエラーが出る

- 必須フィールドが不足していないか確認
- 日付フォーマットが正しいか確認（ISO 8601形式）
- URLが正しいフォーマットか確認

### undefined 値が出力される

各コンポーネントには undefined 値を自動的に除去する処理が含まれています。ただし、データ自体が null や undefined の場合は、適切なフォールバック値を設定してください。

## 参考リンク

- [Schema.org - Event](https://schema.org/Event)
- [Schema.org - LocalBusiness](https://schema.org/LocalBusiness)
- [Schema.org - Article](https://schema.org/Article)
- [Google Search Central - 構造化データ](https://developers.google.com/search/docs/appearance/structured-data)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

## メンテナンス

構造化データは以下の場合に更新が必要です：

1. GraphQL スキーマに新しいフィールドが追加された場合
2. Google の構造化データガイドラインが変更された場合
3. 新しいスキーマタイプを追加する場合

更新後は必ず Google Rich Results Test で検証してください。
