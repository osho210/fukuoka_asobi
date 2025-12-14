# Cloudflare Pages 移行チェックリスト

このドキュメントは、Vercel から Cloudflare Pages への移行作業の進捗を管理するためのチェックリストです。

## 📅 移行スケジュール

| フェーズ | 期間 | 状態 |
|---------|------|------|
| 準備 | 1-2日 | ⬜️ 未開始 |
| テストデプロイ | 1-2日 | ⬜️ 未開始 |
| 本番移行 | 1日 | ⬜️ 未開始 |
| 監視・最適化 | 1週間 | ⬜️ 未開始 |
| Vercel 廃止 | 移行後1週間 | ⬜️ 未開始 |

---

## 🔴 フェーズ 1: 準備作業

### 1.1 現状確認・バックアップ

- [ ] **Vercel 設定のバックアップ**
  - [ ] Frontend プロジェクトの設定をスクリーンショット保存
  - [ ] Admin プロジェクトの設定をスクリーンショット保存
  - [ ] Build & Development Settings の確認
  - [ ] Environment Variables の全リストをエクスポート

- [ ] **DNS 設定の確認**
  - [ ] 現在の DNS プロバイダーを確認
  - [ ] 現在の A/CNAME レコードを記録
  - [ ] TTL 設定を確認（移行前に短く設定する場合）

- [ ] **デプロイ履歴の確認**
  - [ ] 最新の成功したデプロイを確認
  - [ ] デプロイログを保存

### 1.2 環境変数の準備

- [ ] **Frontend 環境変数リスト作成**
  ```
  □ NEXT_PUBLIC_BACKEND_URL
  □ NEXT_PUBLIC_GRAPHQL_ENDPOINT
  □ NEXT_PUBLIC_API_URL
  □ NEXT_PUBLIC_GOOGLE_CLIENT_ID
  □ NODE_ENV
  ```

- [ ] **Admin 環境変数リスト作成**
  ```
  □ NEXT_PUBLIC_BACKEND_URL
  □ NEXT_PUBLIC_GRAPHQL_ENDPOINT
  □ NEXT_PUBLIC_GOOGLE_CLIENT_ID
  □ NEXT_PUBLIC_FRONTEND_URL
  □ NODE_ENV
  ```

- [ ] **環境別の値を準備**
  - [ ] Production 用の値をリストアップ
  - [ ] Preview 用の値をリストアップ

### 1.3 Google OAuth 設定の更新

- [ ] **Google Cloud Console で設定**
  - [ ] 承認済みの JavaScript 生成元に追加
    - [ ] `https://fukuoka-asobi-frontend.pages.dev`
    - [ ] `https://fukuoka-asobi-admin.pages.dev`
  - [ ] 承認済みのリダイレクト URI に追加
    - [ ] Frontend のコールバック URL
    - [ ] Admin のコールバック URL

- [ ] **テスト用のクライアント ID（オプション）**
  - [ ] テスト環境用の別クライアント ID 作成を検討

### 1.4 バックエンド（Rails）の準備

- [ ] **CORS 設定の更新準備**
  - [ ] `backend/config/initializers/cors.rb` を確認
  - [ ] Cloudflare Pages ドメイン追加の手順を確認
  
  ```ruby
  # 手順:
  # 1. Vercel URL の末尾にカンマを追加
  # 2. 以下の2行のコメントを外す：
  # "https://fukuoka-asobi-frontend.pages.dev",
  # "https://fukuoka-asobi-admin.pages.dev"
  ```

- [ ] **ステージング環境の確認**
  - [ ] テスト用バックエンドが利用可能か確認
  - [ ] CORS 設定をテスト環境で先に適用

### 1.5 ドキュメント確認

- [ ] **移行ガイドの確認**
  - [ ] `docs/CLOUDFLARE_PAGES_MIGRATION.md` を読む
  - [ ] 手順を理解する
  - [ ] 不明点をリストアップ

- [ ] **既存ドキュメントの確認**
  - [ ] `docs/VERCEL_DEPLOYMENT_FIX.md` を確認
  - [ ] npm workspaces の構成を理解

---

## 🟡 フェーズ 2: テストデプロイ

### 2.1 Cloudflare アカウント準備

- [ ] **Cloudflare アカウント確認**
  - [ ] Cloudflare にログイン
  - [ ] Workers & Pages セクションにアクセス可能か確認
  - [ ] 無料プランの制限を確認

### 2.2 Frontend プロジェクト作成

- [ ] **プロジェクト設定**
  - [ ] Cloudflare Pages で新規プロジェクト作成
  - [ ] GitHub リポジトリ `osho210/fukuoka_asobi` を接続
  - [ ] プロジェクト名: `fukuoka-asobi-frontend`
  - [ ] Production branch: `main`

- [ ] **ビルド設定**
  ```
  □ Framework preset: Next.js
  □ Build command: npm install && cd frontend && npm run build
  □ Build output directory: frontend/.next
  □ Root directory: (空欄)
  ```

- [ ] **環境変数設定（Production）**
  ```
  □ NEXT_PUBLIC_BACKEND_URL
  □ NEXT_PUBLIC_GRAPHQL_ENDPOINT
  □ NEXT_PUBLIC_API_URL
  □ NEXT_PUBLIC_GOOGLE_CLIENT_ID
  □ NODE_ENV=production
  □ NODE_VERSION=20.11.0
  ```

- [ ] **環境変数設定（Preview）**
  ```
  □ NEXT_PUBLIC_BACKEND_URL (ステージング)
  □ NEXT_PUBLIC_GRAPHQL_ENDPOINT (ステージング)
  □ NEXT_PUBLIC_API_URL (ステージング)
  □ NEXT_PUBLIC_GOOGLE_CLIENT_ID
  □ NODE_ENV=development
  □ NODE_VERSION=20.11.0
  ```

### 2.3 Admin プロジェクト作成

- [ ] **プロジェクト設定**
  - [ ] Cloudflare Pages で新規プロジェクト作成
  - [ ] GitHub リポジトリ `osho210/fukuoka_asobi` を接続
  - [ ] プロジェクト名: `fukuoka-asobi-admin`
  - [ ] Production branch: `main`

- [ ] **ビルド設定**
  ```
  □ Framework preset: Next.js
  □ Build command: npm install && cd admin && npm run build
  □ Build output directory: admin/.next
  □ Root directory: (空欄)
  ```

- [ ] **環境変数設定（Production）**
  ```
  □ NEXT_PUBLIC_BACKEND_URL
  □ NEXT_PUBLIC_GRAPHQL_ENDPOINT
  □ NEXT_PUBLIC_GOOGLE_CLIENT_ID
  □ NEXT_PUBLIC_FRONTEND_URL
  □ NODE_ENV=production
  □ NODE_VERSION=20.11.0
  ```

- [ ] **環境変数設定（Preview）**
  ```
  □ NEXT_PUBLIC_BACKEND_URL (ステージング)
  □ NEXT_PUBLIC_GRAPHQL_ENDPOINT (ステージング)
  □ NEXT_PUBLIC_GOOGLE_CLIENT_ID
  □ NEXT_PUBLIC_FRONTEND_URL (プレビューURL)
  □ NODE_ENV=development
  □ NODE_VERSION=20.11.0
  ```

### 2.4 初回デプロイ

- [ ] **Frontend デプロイ**
  - [ ] デプロイをトリガー
  - [ ] ビルドログを確認
  - [ ] ビルドが成功したか確認
  - [ ] デフォルトドメインを記録: `https://fukuoka-asobi-frontend.pages.dev`

- [ ] **Admin デプロイ**
  - [ ] デプロイをトリガー
  - [ ] ビルドログを確認
  - [ ] ビルドが成功したか確認
  - [ ] デフォルトドメインを記録: `https://fukuoka-asobi-admin.pages.dev`

### 2.5 バックエンド CORS 設定更新

- [ ] **CORS にテストドメイン追加**
  
  `backend/config/initializers/cors.rb` を編集：
  
  ```ruby
  # 変更前
  "https://fukuoka-asobi.vercel.app"
  # Cloudflare Pages への移行時は以下を実施：
  # 1. 上の行の末尾にカンマを追加
  # 2. 以下の2行のコメントを外す：
  # "https://fukuoka-asobi-frontend.pages.dev",
  # "https://fukuoka-asobi-admin.pages.dev"
  
  # 変更後
  "https://fukuoka-asobi.vercel.app",
  "https://fukuoka-asobi-frontend.pages.dev",
  "https://fukuoka-asobi-admin.pages.dev"
  ```

- [ ] **Rails アプリケーション再起動**
  - [ ] 本番環境で CORS 設定を適用
  - [ ] 動作確認

### 2.6 動作確認（Frontend）

- [ ] **基本機能**
  - [ ] トップページが表示される
  - [ ] CSS が正しく適用されている
  - [ ] JavaScript が動作している

- [ ] **GraphQL 通信**
  - [ ] GraphQL クエリが正常に動作する
  - [ ] データが取得できる
  - [ ] エラーレスポンスが適切に処理される

- [ ] **画像表示**
  - [ ] 画像が正しく表示される
  - [ ] Next.js Image コンポーネントが動作する
  - [ ] R2 ストレージの画像が表示される

- [ ] **認証機能**
  - [ ] Google OAuth ログインボタンが表示される
  - [ ] ログインフローが動作する
  - [ ] JWT トークンが正しく保存される
  - [ ] ログイン状態が維持される
  - [ ] ログアウトが動作する

- [ ] **API リクエスト**
  - [ ] REST API が動作する
  - [ ] エラーハンドリングが適切

- [ ] **パフォーマンス**
  - [ ] ページ読み込み速度が許容範囲
  - [ ] Lighthouse スコアを確認
    - [ ] Performance: 90+
    - [ ] Accessibility: 90+
    - [ ] Best Practices: 90+
    - [ ] SEO: 90+

### 2.7 動作確認（Admin）

- [ ] **基本機能**
  - [ ] 管理画面が表示される
  - [ ] Radix UI コンポーネントが正しく表示される
  - [ ] CSS が正しく適用されている

- [ ] **GraphQL 通信**
  - [ ] GraphQL クエリが正常に動作する
  - [ ] Mutation が動作する

- [ ] **認証機能**
  - [ ] Google OAuth ログインが動作する
  - [ ] 管理者権限の確認が動作する
  - [ ] ログアウトが動作する

- [ ] **CRUD 操作**
  - [ ] データの作成が動作する
  - [ ] データの読み取りが動作する
  - [ ] データの更新が動作する
  - [ ] データの削除が動作する

- [ ] **画像アップロード**
  - [ ] 画像アップロードが動作する
  - [ ] プレビューが表示される
  - [ ] 画像が正しく保存される

### 2.8 エラー確認

- [ ] **Cloudflare ログ確認**
  - [ ] Functions ログを確認
  - [ ] エラーがないか確認
  - [ ] 警告を確認

- [ ] **ブラウザコンソール確認**
  - [ ] JavaScript エラーがないか確認
  - [ ] CORS エラーがないか確認
  - [ ] ネットワークエラーがないか確認

---

## 🟢 フェーズ 3: 本番移行

### 3.1 カスタムドメイン設定

- [ ] **Frontend カスタムドメイン**
  - [ ] Cloudflare Pages でカスタムドメイン追加
    - [ ] `fukuoka-asobi.com`
    - [ ] `www.fukuoka-asobi.com`（オプション）
  - [ ] SSL 証明書の自動発行を確認

- [ ] **Admin カスタムドメイン**
  - [ ] Cloudflare Pages でカスタムドメイン追加
    - [ ] `admin.fukuoka-asobi.com`
  - [ ] SSL 証明書の自動発行を確認

### 3.2 DNS 設定変更

- [ ] **DNS レコードの更新準備**
  - [ ] Cloudflare が提供する DNS レコードを確認
  - [ ] 既存の DNS 設定をバックアップ

- [ ] **DNS 切り替え**
  - [ ] A レコードまたは CNAME レコードを更新
  - [ ] TTL が短く設定されているか確認
  - [ ] 反映を待つ（TTL 時間による）

- [ ] **DNS 反映確認**
  - [ ] `dig fukuoka-asobi.com` で確認
  - [ ] `nslookup fukuoka-asobi.com` で確認
  - [ ] ブラウザでアクセスして確認

### 3.3 本番環境での動作確認

- [ ] **全機能の再確認**
  - [ ] フェーズ 2.6 の Frontend チェック項目を再実行
  - [ ] フェーズ 2.7 の Admin チェック項目を再実行

- [ ] **SSL 証明書確認**
  - [ ] HTTPS でアクセスできる
  - [ ] 証明書が有効
  - [ ] Mixed Content エラーがない

- [ ] **SEO 確認**
  - [ ] メタタグが正しく設定されている
  - [ ] OGP タグが動作する
  - [ ] robots.txt が適切

### 3.4 ユーザー通知

- [ ] **ユーザーへの通知**
  - [ ] 移行スケジュールを通知（必要に応じて）
  - [ ] メンテナンス時間を通知（必要に応じて）
  - [ ] 再ログインが必要な場合は案内

---

## 🔵 フェーズ 4: 監視・最適化

### 4.1 監視設定

- [ ] **Cloudflare Analytics**
  - [ ] Web Analytics を有効化
  - [ ] トラフィックを確認
  - [ ] パフォーマンスメトリクスを確認

- [ ] **エラー監視**
  - [ ] Functions ログを定期的に確認
  - [ ] エラーアラートを設定（必要に応じて）

- [ ] **パフォーマンス監視**
  - [ ] ページ読み込み速度を監視
  - [ ] Core Web Vitals を確認
  - [ ] Lighthouse スコアを定期確認

### 4.2 ユーザーフィードバック収集

- [ ] **ユーザーからの報告確認**
  - [ ] エラー報告がないか確認
  - [ ] パフォーマンスの問題報告がないか確認
  - [ ] 機能の不具合報告がないか確認

### 4.3 最適化

- [ ] **パフォーマンス最適化**
  - [ ] 必要に応じてキャッシュ設定を調整
  - [ ] 画像最適化の設定を確認
  - [ ] ビルド設定の最適化

- [ ] **コスト確認**
  - [ ] Cloudflare の使用量を確認
  - [ ] 無料枠内に収まっているか確認
  - [ ] 必要に応じてプラン変更を検討

---

## 🟣 フェーズ 5: Vercel 廃止

### 5.1 Vercel プロジェクトの確認

- [ ] **安定稼働の確認**
  - [ ] Cloudflare Pages で 1週間以上安定稼働
  - [ ] 重大なエラーがない
  - [ ] パフォーマンスが許容範囲

### 5.2 CORS 設定のクリーンアップ

- [ ] **Vercel ドメインを CORS から削除**
  ```ruby
  # backend/config/initializers/cors.rb
  # "https://fukuoka-asobi.vercel.app" を削除
  ```

- [ ] **デフォルトドメインの削除（オプション）**
  ```ruby
  # 必要に応じて *.pages.dev も削除
  # カスタムドメインのみ許可する場合
  ```

- [ ] **Rails アプリケーション再起動**
  - [ ] CORS 設定を適用
  - [ ] 動作確認

### 5.3 Google OAuth 設定のクリーンアップ

- [ ] **Vercel ドメインを削除**
  - [ ] Google Cloud Console で設定
  - [ ] 承認済みの JavaScript 生成元から Vercel URL を削除
  - [ ] 承認済みのリダイレクト URI から Vercel URL を削除

### 5.4 Vercel プロジェクトの削除

- [ ] **Frontend プロジェクトの削除**
  - [ ] 最終バックアップ確認
  - [ ] Vercel Dashboard でプロジェクトを削除

- [ ] **Admin プロジェクトの削除**
  - [ ] 最終バックアップ確認
  - [ ] Vercel Dashboard でプロジェクトを削除

### 5.5 ドキュメント更新

- [ ] **README 更新**
  - [ ] デプロイ先を Cloudflare Pages に変更
  - [ ] デプロイ手順を更新

- [ ] **移行記録の作成**
  - [ ] 移行作業のサマリーを作成
  - [ ] 発生した問題と解決策を記録
  - [ ] 今後の改善点をリストアップ

---

## 📊 移行完了確認

### 最終チェックリスト

- [ ] ✅ Frontend が Cloudflare Pages で正常稼働
- [ ] ✅ Admin が Cloudflare Pages で正常稼働
- [ ] ✅ カスタムドメインが正しく設定されている
- [ ] ✅ SSL 証明書が有効
- [ ] ✅ 全機能が正常に動作
- [ ] ✅ パフォーマンスが許容範囲
- [ ] ✅ エラーが発生していない
- [ ] ✅ ユーザーからのクレームがない
- [ ] ✅ Vercel プロジェクトが削除済み
- [ ] ✅ ドキュメントが更新済み

---

## 🚨 ロールバック手順（緊急時）

### Cloudflare Pages に問題が発生した場合

1. **即座に DNS を Vercel に戻す**
   - [ ] DNS レコードを Vercel の設定に戻す
   - [ ] 反映を確認

2. **CORS 設定を確認**
   - [ ] Vercel ドメインが CORS に含まれているか確認
   - [ ] 必要に応じて追加

3. **動作確認**
   - [ ] Vercel でアプリケーションが正常に動作するか確認

4. **原因調査**
   - [ ] Cloudflare Pages でのエラーを調査
   - [ ] ログを確認
   - [ ] 問題を特定

5. **再移行の判断**
   - [ ] 問題が解決可能か判断
   - [ ] 再移行スケジュールを計画

---

## 📝 備考

### 重要な注意事項

- **環境変数の管理**: 本番とプレビューで異なる値を設定すること
- **CORS 設定**: 移行期間中は Vercel と Cloudflare Pages 両方のドメインを許可すること
- **Google OAuth**: リダイレクト URI を事前に追加すること
- **ユーザー通知**: 再ログインが必要な場合は事前に通知すること

### 連絡先

- **技術サポート**: Cloudflare Support
- **緊急連絡先**: （プロジェクトの担当者情報）

---

## 📅 移行完了日

**予定日**: _______________

**実際の完了日**: _______________

**責任者**: _______________

**確認者**: _______________

---

**最終更新**: 2024-12-14
