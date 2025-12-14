# Cloudflare Pages 移行ガイド

## 📋 目次
- [背景](#背景)
- [移行前の準備](#移行前の準備)
- [Cloudflare Pages の設定手順](#cloudflare-pages-の設定手順)
- [環境変数の設定](#環境変数の設定)
- [ビルド設定](#ビルド設定)
- [懸念事項と対応状況](#懸念事項と対応状況)
- [ロールバック手順](#ロールバック手順)
- [検証項目](#検証項目)

## 背景

フロントエンド（Next.js）を Vercel で配信しているが、無料枠の利用制限に到達したため **Cloudflare Pages への移管を検討**している。

### 移行目標
- ✅ 無料枠での安定配信
- ✅ 開発速度を落とさない
- ✅ 問題時は即 Vercel に戻せる状態を維持

## 移行前の準備

### 1. 現状確認

#### プロジェクト構成
```
fukuoka-asobi/
├── package.json          # ルート（npm workspaces 設定）
├── frontend/
│   ├── package.json      # フロントエンドアプリ
│   └── vercel.json       # Vercel 設定（現行）
└── admin/
    ├── package.json      # 管理画面アプリ
    └── vercel.json       # Vercel 設定（現行）
```

#### 現在の環境変数（Frontend）
- `NEXT_PUBLIC_BACKEND_URL` - バックエンド API の URL
- `NEXT_PUBLIC_GRAPHQL_ENDPOINT` - GraphQL エンドポイント
- `NEXT_PUBLIC_API_URL` - API ベース URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth クライアント ID
- `NODE_ENV` - 環境設定（production/development）

#### 現在の環境変数（Admin）
- `NEXT_PUBLIC_BACKEND_URL` - バックエンド API の URL
- `NEXT_PUBLIC_GRAPHQL_ENDPOINT` - GraphQL エンドポイント
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth クライアント ID
- `NEXT_PUBLIC_FRONTEND_URL` - フロントエンド URL（リンク用）
- `NODE_ENV` - 環境設定（production/development）

### 2. バックアップ

移行前に以下を確保：
- ✅ Vercel の全設定をスクリーンショットで保存
- ✅ 環境変数のリストをエクスポート
- ✅ デプロイ履歴の確認
- ✅ DNS 設定の確認

## Cloudflare Pages の設定手順

### プロジェクト作成（Frontend）

1. **Cloudflare Dashboard にログイン**
   - https://dash.cloudflare.com/ にアクセス
   - Workers & Pages を選択

2. **新規プロジェクト作成**
   - "Create application" → "Pages" → "Connect to Git"
   - GitHub リポジトリ: `osho210/fukuoka_asobi` を選択

3. **ビルド設定**
   ```
   Project name: fukuoka-asobi-frontend
   Production branch: main
   
   Build settings:
   - Framework preset: Next.js
   - Build command: npm install && cd frontend && npm run build
   - Build output directory: frontend/.next
   - Root directory: (空欄 - ルートディレクトリを使用)
   ```

   **重要**: Cloudflare Pages では、ルートから `npm install` を実行してワークスペース全体をインストールする必要があります。

4. **環境変数の設定**（後述の「環境変数の設定」セクション参照）

### プロジェクト作成（Admin）

1. **新規プロジェクト作成**
   - 同じリポジトリから別プロジェクトとして作成

2. **ビルド設定**
   ```
   Project name: fukuoka-asobi-admin
   Production branch: main
   
   Build settings:
   - Framework preset: Next.js
   - Build command: npm install && cd admin && npm run build
   - Build output directory: admin/.next
   - Root directory: (空欄 - ルートディレクトリを使用)
   ```

## 環境変数の設定

### Frontend 環境変数

Cloudflare Pages Dashboard → Settings → Environment variables

#### Production（本番環境）
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-backend-domain.com/graphql
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NODE_ENV=production
```

#### Preview（プレビュー環境）
```
NEXT_PUBLIC_BACKEND_URL=https://your-staging-backend.com
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-staging-backend.com/graphql
NEXT_PUBLIC_API_URL=https://your-staging-backend.com/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NODE_ENV=development
```

### Admin 環境変数

#### Production（本番環境）
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-backend-domain.com/graphql
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_FRONTEND_URL=https://fukuoka-asobi.com
NODE_ENV=production
```

#### Preview（プレビュー環境）
```
NEXT_PUBLIC_BACKEND_URL=https://your-staging-backend.com
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-staging-backend.com/graphql
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_FRONTEND_URL=https://your-preview-frontend.pages.dev
NODE_ENV=development
```

## ビルド設定

### npm Workspaces 対応

Cloudflare Pages では、以下のビルドコマンドを使用します：

#### Frontend
```bash
# 1. ルートで npm install（workspaces 全体をインストール）
npm install

# 2. frontend ディレクトリに移動してビルド
cd frontend && npm run build
```

#### Admin
```bash
# 1. ルートで npm install（workspaces 全体をインストール）
npm install

# 2. admin ディレクトリに移動してビルド
cd admin && npm run build
```

### ビルドコマンドの最適化

Cloudflare Pages の Build command に設定：

**Frontend:**
```
npm install && cd frontend && npm run build
```

**Admin:**
```
npm install && cd admin && npm run build
```

### Node.js バージョン

Cloudflare Pages では、環境変数でバージョン指定可能：

```
NODE_VERSION=20.11.0
```

または `.nvmrc` / `.node-version` ファイルで指定：

```bash
# ルートディレクトリに作成
echo "20.11.0" > .node-version
```

## 懸念事項と対応状況

### 🔴 Issue 1: npm Workspaces のビルド対応（✅ 解決済み）

**対応策:**
- ビルドコマンドで `npm install` をルートで実行
- その後、各ディレクトリに `cd` してビルド実行
- Cloudflare Pages は npm workspaces をサポート

**検証方法:**
```bash
# ローカルで検証
npm install
cd frontend && npm run build
cd ../admin && npm run build
```

### 🔴 Issue 2: 環境変数の移行と設定（✅ 対応完了）

**対応策:**
- 全環境変数をリストアップ済み
- Production / Preview 環境ごとの設定手順を明確化
- Cloudflare Pages Dashboard での設定方法を文書化

### 🔴 Issue 3: CORS 設定の更新（⚠️ 要対応）

**現在の CORS 設定（Rails）:**
```ruby
origins "https://fukuoka-asobi.com",
        "https://www.fukuoka-asobi.com",
        "http://localhost:8200",
        "http://localhost:9200",
        "https://fukuoka-asobi.vercel.app"
```

**必要な対応:**

1. **Cloudflare Pages デフォルトドメインを追加**
   
   `backend/config/initializers/cors.rb` を編集して、コメントアウトされている2行のコメントを外します：
   
   ```ruby
   # 変更前
   "https://fukuoka-asobi.vercel.app"
   # Cloudflare Pages への移行時は以下の2行のコメントを外してください：
   # ,"https://fukuoka-asobi-frontend.pages.dev"
   # ,"https://fukuoka-asobi-admin.pages.dev"
   
   # 変更後
   "https://fukuoka-asobi.vercel.app",
   "https://fukuoka-asobi-frontend.pages.dev",
   "https://fukuoka-asobi-admin.pages.dev"
   ```

2. **カスタムドメイン設定後**
   - DNS を Cloudflare Pages に向ける
   - 既存ドメイン（fukuoka-asobi.com）は引き続き使用可能

3. **移行完了後**
   - Vercel ドメインを削除
   - Cloudflare Pages デフォルトドメインも削除可能（カスタムドメインのみ許可）

**手順:**
```bash
# backend/config/initializers/cors.rb を編集
# 移行完了後、Vercel ドメインを削除
```

### 🟡 Issue 4: Next.js rewrites / routing 設定（✅ 問題なし）

**現状確認:**
- `next.config.ts` で rewrites を使用
- **開発環境のみ**で有効化（`NODE_ENV === 'development'`）
- 本番環境では環境変数で API URL を直接指定

**結論:**
- Cloudflare Pages での影響なし
- 本番では `NEXT_PUBLIC_BACKEND_URL` 等で直接指定するため問題なし

### 🟡 Issue 5: 画像最適化の違い（✅ 対応済み）

**調査結果:**
- Cloudflare Pages は Next.js の Image Optimization をサポート
- `@cloudflare/next-on-pages` アダプターを使用すれば利用可能
- 既存の `next.config.ts` の `images` 設定はそのまま利用可能

**現在の設定:**
```typescript
images: {
  domains: ["localhost"],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.r2.cloudflarestorage.com',
      pathname: '/**',
    },
    // ...
  ],
}
```

**結論:**
- 既存の設定で問題なし
- Cloudflare R2 との連携も設定済み

### 🟡 Issue 6: Cookie / セッション管理（⚠️ 要確認）

**懸念:**
- ドメイン変更時の Cookie 非共有
- SameSite / Secure / Domain 設定の影響

**対応策:**

1. **移行時の Cookie 設定確認**
   - `pages.dev` ドメインでの動作確認
   - カスタムドメイン適用後の動作確認

2. **認証テスト項目**
   - Google OAuth ログインの動作確認
   - JWT トークンの受け渡し確認
   - セッション維持の確認

3. **注意点**
   - Cloudflare Pages（`*.pages.dev`）から本番ドメイン（`fukuoka-asobi.com`）に変更時
   - ユーザーは再ログインが必要になる可能性あり
   - **推奨**: 最初からカスタムドメインを設定

### 🟡 Issue 7: GraphQL CodeGen のビルド対応（✅ 対応済み）

**現状:**
- GraphQL CodeGen は事前に実行済み
- `src/__generated__/` ディレクトリに生成されたファイルをコミット
- ビルド時には CodeGen は実行しない（`npm run build` のみ）

**Cloudflare Pages での対応:**
- 特別な対応不要
- 既存のビルドプロセスで問題なし

**ビルド時間・メモリ:**
- Cloudflare Pages 無料プランの制限:
  - ビルド時間: 20分/月 500回
  - メモリ: 十分なリソース提供
- Next.js のビルドは通常 1-3分で完了するため問題なし

### 🔵 Issue 8: Analytics / モニタリング（📝 推奨設定）

**Cloudflare Web Analytics の導入:**

1. **設定方法**
   - Cloudflare Dashboard → Analytics & Logs → Web Analytics
   - JavaScript スニペットを取得

2. **Next.js への統合**
   ```tsx
   // app/layout.tsx に追加
   <Script
     src="https://static.cloudflareinsights.com/beacon.min.js"
     data-cf-beacon='{"token": "your-analytics-token"}'
     strategy="afterInteractive"
   />
   ```

3. **代替案**
   - Google Analytics（既存の場合）
   - Vercel Analytics からデータエクスポート（移行前）

### 🔵 Issue 10: ロールバック戦略（✅ 策定済み）

**ロールバック手順:**

#### パターン A: Cloudflare Pages でエラーが発生した場合

1. **即座に Vercel に戻す**
   ```bash
   # DNS を Vercel に戻す（Cloudflare Dashboard で設定）
   # または、一時的に Vercel のデフォルトドメインに誘導
   ```

2. **CORS 設定の確認**
   - Vercel ドメインが CORS に含まれているか確認

3. **動作確認**
   - Vercel でアプリケーションが正常に動作するか確認

#### パターン B: デプロイのロールバック

1. **Cloudflare Pages のデプロイ履歴から復元**
   - Cloudflare Dashboard → Deployments
   - 前のデプロイを選択 → "Rollback to this deployment"

2. **環境変数の確認**
   - ロールバック後、環境変数が正しいか確認

#### パターン C: DNS の即時切り替え

**Cloudflare DNS を使用している場合:**
- プロキシ機能（オレンジクラウド）を使用
- 即座に切り替え可能（数秒〜数分）

**他の DNS を使用している場合:**
- TTL を短く設定（例: 300秒）
- 切り替え後、最大 TTL 時間で反映

## 検証項目

### 移行前のチェックリスト

- [ ] Vercel の全設定をバックアップ
- [ ] 環境変数リストを確認・エクスポート
- [ ] DNS 設定を確認
- [ ] Google OAuth リダイレクト URI を確認
  - [ ] Frontend: `https://*.pages.dev/auth/callback` を追加
  - [ ] Admin: `https://*.pages.dev/auth/callback` を追加

### Cloudflare Pages 設定後のチェックリスト

- [ ] Frontend プロジェクト作成完了
- [ ] Admin プロジェクト作成完了
- [ ] ビルドコマンドが正しく設定されている
- [ ] 環境変数が正しく設定されている（Production / Preview）
- [ ] `.node-version` ファイルを追加（Node.js 20.x）
- [ ] backend の CORS 設定に Cloudflare Pages ドメインを追加

### 初回デプロイ後の検証

#### Frontend

- [ ] デプロイが成功している
- [ ] トップページが表示される
- [ ] GraphQL クエリが動作する
- [ ] 画像が正しく表示される
- [ ] Google OAuth ログインが動作する
  - [ ] ログインできる
  - [ ] JWT トークンが正しく保存される
  - [ ] ログアウトできる
- [ ] API リクエストが正常に動作する
- [ ] レスポンス時間が許容範囲内

#### Admin

- [ ] デプロイが成功している
- [ ] 管理画面が表示される
- [ ] GraphQL クエリが動作する
- [ ] Google OAuth ログインが動作する
- [ ] CRUD 操作が正常に動作する

### カスタムドメイン設定後の検証

- [ ] `fukuoka-asobi.com` が Cloudflare Pages に向いている
- [ ] SSL 証明書が正しく発行されている
- [ ] www サブドメインのリダイレクトが動作する
- [ ] すべての機能が動作する（上記と同様）

### パフォーマンス検証

- [ ] ページ読み込み速度（Lighthouse スコア）
  - [ ] Performance: 90+
  - [ ] Accessibility: 90+
  - [ ] Best Practices: 90+
  - [ ] SEO: 90+
- [ ] API レスポンス時間
- [ ] 画像読み込み速度

### 監視・運用

- [ ] Cloudflare Web Analytics 設定完了
- [ ] エラーログの確認方法を確認
- [ ] デプロイ通知の設定（Slack / Email）

## トラブルシューティング

### ビルドが失敗する

**問題**: `Cannot find module 'next'`
```
原因: npm workspaces の依存関係が正しくインストールされていない

解決策:
1. ビルドコマンドを確認
   npm install && cd frontend && npm run build
   
2. package.json に next が明示的に定義されているか確認
   "dependencies": {
     "next": "15.3.8"
   }
```

**問題**: `GraphQL CodeGen` のエラー
```
原因: 生成されたファイルがコミットされていない

解決策:
1. ローカルで生成
   cd frontend && npm run generate
   
2. 生成されたファイルをコミット
   git add frontend/src/__generated__
   git commit -m "graphql: 生成ファイルを追加"
```

### 環境変数が反映されない

```
解決策:
1. Cloudflare Dashboard で環境変数を確認
2. Production / Preview の設定が正しいか確認
3. 再デプロイを実行
```

### CORS エラーが発生する

```
解決策:
1. backend/config/initializers/cors.rb を確認
2. Cloudflare Pages のドメインが含まれているか確認
3. Rails を再起動
```

### 画像が表示されない

```
解決策:
1. next.config.ts の remotePatterns を確認
2. 画像の URL が正しいか確認
3. Cloudflare R2 の CORS 設定を確認
```

## 参考リンク

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Deploy a Next.js site - Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [npm Workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Cloudflare Web Analytics](https://developers.cloudflare.com/analytics/web-analytics/)

## 移行タイムライン例

### フェーズ 1: 準備（1-2日）
- [ ] ドキュメント確認
- [ ] 環境変数のバックアップ
- [ ] Google OAuth リダイレクト URI の設定

### フェーズ 2: テストデプロイ（1-2日）
- [ ] Cloudflare Pages プロジェクト作成
- [ ] デフォルトドメイン（*.pages.dev）でデプロイ
- [ ] 全機能の動作確認

### フェーズ 3: 本番移行（1日）
- [ ] カスタムドメイン設定
- [ ] DNS 切り替え
- [ ] 動作確認

### フェーズ 4: 監視・最適化（1週間）
- [ ] エラー監視
- [ ] パフォーマンス確認
- [ ] 必要に応じて調整

### フェーズ 5: Vercel 廃止（移行後1週間）
- [ ] Cloudflare Pages での安定稼働確認
- [ ] Vercel プロジェクトの削除
- [ ] CORS から Vercel ドメインを削除

## まとめ

Cloudflare Pages への移行は、適切な準備と設定により問題なく実施可能です。

### 主な利点
✅ 無料枠が十分（Vercel より広い）
✅ Cloudflare のネットワークを活用した高速配信
✅ npm workspaces のサポート
✅ Next.js Image Optimization のサポート
✅ 簡単なロールバック機能

### 注意点
⚠️ CORS 設定の更新が必須
⚠️ 環境変数の再設定が必要
⚠️ Google OAuth リダイレクト URI の更新が必要
⚠️ 初回移行時、ユーザーの再ログインが必要な可能性

### 推奨事項
🎯 段階的な移行（テストデプロイ → 本番移行）
🎯 ロールバック戦略の準備
🎯 監視体制の構築
🎯 移行後1週間の集中監視
