# JSON-LD 出力例

このファイルには、各ページで生成される JSON-LD の出力例を記載しています。

## Event Schema の出力例

イベント詳細ページ (`/events/1`) で生成される JSON-LD：

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "福岡花火大会2024",
  "description": "福岡市中央区で開催される夏の花火大会。約6000発の花火が夜空を彩ります。",
  "startDate": "2024-08-01T19:00:00+09:00",
  "endDate": "2024-08-01T21:00:00+09:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "福岡市中央区天神",
    "address": "福岡市中央区天神1-1-1",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 33.5904,
      "longitude": 130.4017
    }
  },
  "image": "https://example.com/hanabi-banner.jpg",
  "organizer": {
    "@type": "Organization",
    "name": "福岡市観光協会",
    "email": "info@fukuoka-tourism.jp",
    "telephone": "092-123-4567"
  },
  "offers": {
    "@type": "Offer",
    "price": 0,
    "priceCurrency": "JPY",
    "availability": "https://schema.org/InStock",
    "validFrom": "2024-08-01T19:00:00+09:00"
  },
  "performer": {
    "@type": "Organization",
    "name": "福岡市観光協会"
  }
}
```

## LocalBusiness Schema の出力例

スポット詳細ページ (`/spots/1`) で生成される JSON-LD：

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "カフェ福岡",
  "description": "福岡市中央区にあるおしゃれなカフェ。自家製スイーツとこだわりのコーヒーが人気。",
  "image": "https://example.com/cafe-fukuoka.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "福岡市中央区天神2-3-4",
    "addressLocality": "中央区",
    "addressRegion": "福岡県",
    "addressCountry": "JP"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 33.5904,
    "longitude": 130.4017
  },
  "url": "https://cafe-fukuoka.example.com",
  "telephone": "092-234-5678",
  "priceRange": "¥1000-¥2000",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Monday",
      "opens": "09:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Tuesday",
      "opens": "09:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Wednesday",
      "opens": "09:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Thursday",
      "opens": "09:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Friday",
      "opens": "09:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "10:00",
      "closes": "20:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.5,
    "reviewCount": 120
  },
  "servesCuisine": "カフェ, スイーツ",
  "acceptsReservations": true,
  "paymentAccepted": "Credit Card, Cash"
}
```

## Article Schema の出力例

プラン詳細ページ (`/plans/1`) で生成される JSON-LD：

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "福岡天神デートプラン",
  "description": "福岡市中央区天神エリアを巡るデートコース。カフェ、ショッピング、ディナーまで1日楽しめます。",
  "image": "https://example.com/tenjin-date-plan.jpg",
  "datePublished": "2024-01-15T10:00:00+09:00",
  "dateModified": "2024-02-01T15:30:00+09:00",
  "author": {
    "@type": "Person",
    "name": "山田花子",
    "image": "https://example.com/avatar/yamada.jpg"
  },
  "publisher": {
    "@type": "Organization",
    "name": "福岡遊び日記",
    "logo": {
      "@type": "ImageObject",
      "url": "https://fukuoka-asobi.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://fukuoka-asobi.com/plans/1"
  }
}
```

## 実際のページでの表示

各ページの `<head>` タグ内に、以下のように JSON-LD が埋め込まれます：

```html
<!DOCTYPE html>
<html>
<head>
  <title>福岡花火大会2024 | 福岡遊び日記</title>
  <meta name="description" content="...">
  
  <!-- JSON-LD 構造化データ -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "福岡花火大会2024",
    ...
  }
  </script>
</head>
<body>
  ...
</body>
</html>
```

## 検索結果での表示例

### Event のリッチリザルト

```
福岡花火大会2024
福岡市観光協会 - 2024年8月1日 19:00-21:00
★ 福岡市中央区天神
無料 | オフライン開催

福岡市中央区で開催される夏の花火大会。約6000発の花火が...
```

### LocalBusiness のリッチリザルト

```
カフェ福岡
★★★★★ 4.5 (120件のレビュー)
カフェ, スイーツ · ¥1000-¥2000
福岡市中央区天神2-3-4

営業時間: 月-木 9:00-18:00, 金-土 9:00-20:00
予約可 | クレジットカード可

福岡市中央区にあるおしゃれなカフェ...
```

### Article のリッチリザルト

```
福岡天神デートプラン
福岡遊び日記 · 山田花子 著
2024年1月15日 - 2024年2月1日更新

[画像]

福岡市中央区天神エリアを巡るデートコース。カフェ、ショッピング...
```

## 確認方法

1. **ブラウザでソースを表示**
   - ページを右クリック → 「ページのソースを表示」
   - `<script type="application/ld+json">` を検索

2. **Google Rich Results Test**
   - https://search.google.com/test/rich-results
   - ページURLを入力してテスト

3. **Chrome DevTools**
   - F12 → Elements タブ → `<head>` タグを展開
   - JSON-LD スクリプトタグを確認

## 注意事項

- 実際の出力は、データベースに保存されている情報によって異なります
- null や undefined の値は自動的に除外されます
- 日付は ISO 8601 形式で出力されます
- 画像URLは絶対URLである必要があります
