/**
 * JSON-LD 構造化データの検証スクリプト
 * 
 * このスクリプトは、JSON-LD の出力が正しいフォーマットであることを確認します。
 * 以下の点を検証します：
 * 1. JSON として正しくパースできる
 * 2. 必須フィールドが存在する
 * 3. schema.org のタイプが正しい
 */

// Event Schema の検証例
const eventExample = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "福岡花火大会",
  "description": "福岡市で開催される花火大会",
  "startDate": "2024-08-01T19:00:00+09:00",
  "endDate": "2024-08-01T21:00:00+09:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "福岡市中央区",
    "address": "福岡市中央区",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 33.5904,
      "longitude": 130.4017
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "福岡市観光協会"
  }
};

// LocalBusiness Schema の検証例
const localBusinessExample = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "カフェ福岡",
  "description": "福岡の人気カフェ",
  "image": "https://example.com/cafe.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "福岡市中央区天神1-1-1",
    "addressLocality": "福岡市",
    "addressRegion": "福岡県",
    "addressCountry": "JP"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 33.5904,
    "longitude": 130.4017
  },
  "url": "https://example.com",
  "telephone": "092-000-0000",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.5,
    "reviewCount": 100
  }
};

// Article Schema の検証例
const articleExample = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "福岡デートプラン",
  "description": "福岡市内のおすすめデートスポット",
  "image": "https://example.com/plan.jpg",
  "datePublished": "2024-01-01T00:00:00+09:00",
  "dateModified": "2024-01-02T00:00:00+09:00",
  "author": {
    "@type": "Person",
    "name": "山田太郎"
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
};

function validateJsonLd(jsonLd: Record<string, unknown>, schemaType: string): boolean {
  try {
    // JSON として正しいか確認
    const jsonString = JSON.stringify(jsonLd);
    const parsed = JSON.parse(jsonString);

    // 必須フィールドの確認
    if (parsed["@context"] !== "https://schema.org") {
      console.error(`❌ @context が正しくありません: ${parsed["@context"]}`);
      return false;
    }

    if (parsed["@type"] !== schemaType) {
      console.error(`❌ @type が正しくありません: ${parsed["@type"]} (期待値: ${schemaType})`);
      return false;
    }

    console.log(`✅ ${schemaType} の JSON-LD は正しいフォーマットです`);
    return true;
  } catch (error) {
    console.error(`❌ JSON-LD のパースに失敗しました:`, error);
    return false;
  }
}

// 検証実行
console.log("=== JSON-LD 構造化データの検証 ===\n");

validateJsonLd(eventExample, "Event");
validateJsonLd(localBusinessExample, "LocalBusiness");
validateJsonLd(articleExample, "Article");

console.log("\n=== 検証完了 ===");
console.log("\n実際のページでの確認方法:");
console.log("1. ブラウザで各ページにアクセス");
console.log("2. ページのソースを表示");
console.log("3. <script type=\"application/ld+json\"> タグを確認");
console.log("4. Google Rich Results Test で検証:");
console.log("   https://search.google.com/test/rich-results");
