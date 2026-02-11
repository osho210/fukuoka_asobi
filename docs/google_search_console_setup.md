# Google Search Console 導入ガイド

## 概要

このドキュメントでは、福岡遊び日記に Google Search Console を導入する手順について説明します。

## 実装内容

### 1. メタタグによる所有権確認

`frontend/src/app/layout.tsx` に Google Search Console verification メタタグを追加しました。

```tsx
export const metadata: Metadata = {
  title: "福岡遊び日記",
  description: "福岡の遊び場所を探すアプリ",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};
```

### 2. 環境変数の設定

verification コードは環境変数として管理します。

#### ローカル開発環境

`frontend/.env.local` ファイルを作成し、以下を設定:

```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-site-verification-code
```

#### Cloudflare Pages 環境

Cloudflare Dashboard で以下の環境変数を設定:

1. Cloudflare Dashboard → Workers & Pages → 該当プロジェクト
2. Settings → Environment variables
3. 以下の変数を追加:
   - 変数名: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
   - 値: Google Search Console から取得した verification コード
4. Production / Preview 両方の環境に設定
5. Save をクリック
6. 再デプロイして反映

## Google Search Console での設定手順

### 1. プロパティの追加

1. [Google Search Console](https://search.google.com/search-console) にアクセス
2. 「プロパティを追加」をクリック
3. プロパティタイプを選択:
   - **URL プレフィックス**: `https://fukuoka-asobi.com/` (推奨)
   - **ドメイン**: `fukuoka-asobi.com` (DNS検証が必要)

### 2. 所有権の確認

URL プレフィックスを選択した場合:

1. 「HTML タグ」による確認方法を選択
2. 表示される verification コード（`content="..."` の値）をコピー
3. Cloudflare Pages の環境変数 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` に設定
4. デプロイ完了後、Google Search Console で「確認」ボタンをクリック

### 3. 確認後の設定

所有権確認後、以下が利用可能になります:

- **検索パフォーマンス**: クエリ、クリック数、表示回数、CTR
- **URL 検査**: 特定ページのインデックス状況
- **カバレッジ**: インデックス登録されたページ数とエラー
- **サイトマップ**: サイトマップの送信と状態確認
- **モバイル ユーザビリティ**: モバイル対応の問題検出

## サイトマップの登録（オプション）

サイトマップを作成している場合、Google Search Console に登録することでクロール効率が向上します:

1. Google Search Console でプロパティを選択
2. 左メニュー「サイトマップ」をクリック
3. サイトマップの URL を入力（例: `https://fukuoka-asobi.com/sitemap.xml`）
4. 送信

## 注意事項

- 環境変数 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` が設定されていない場合、メタタグは出力されません（Next.js の仕様）
- verification コードは本番環境とプレビュー環境で同じ値を使用可能です
- 所有権確認は初回のみ必要で、確認後はメタタグを削除しても所有権は維持されます（ただし、削除は非推奨）

## トラブルシューティング

### 所有権の確認ができない

1. デプロイが正常に完了しているか確認
2. 環境変数が正しく設定されているか確認
3. ブラウザで `https://fukuoka-asobi.com/` にアクセスし、ページのソースを表示
4. `<meta name="google-site-verification" content="...">` タグが出力されているか確認
5. verification コードが正しいか確認

### メタタグが出力されない

1. 環境変数 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` が設定されているか確認
2. Cloudflare Pages の環境変数設定後に再デプロイを実施
3. ビルドログで環境変数が認識されているか確認

## 参考リンク

- [Google Search Console](https://search.google.com/search-console)
- [Next.js Metadata - verification](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#verification)
- [Google Search Console ヘルプ](https://support.google.com/webmasters/answer/9008080)
