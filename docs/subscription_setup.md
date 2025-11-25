# サブスクリプション機能セットアップガイド

## 概要

このドキュメントは、Stripe決済を使用した月額980円のサブスクリプション機能のセットアップ手順を説明します。

## 1. Stripeアカウントの設定

### 1.1 Stripeアカウント作成
1. https://stripe.com にアクセス
2. アカウントを作成
3. ダッシュボードにログイン

### 1.2 商品とプライスの作成
1. Stripeダッシュボードで「商品」→「商品を追加」をクリック
2. 商品情報を入力:
   - 商品名: 福岡あそび 有料会員
   - 説明: 無制限のプラン検索と詳細オプションを利用したプラン作成
3. 価格情報を入力:
   - 価格: ¥980
   - 請求期間: 月次
   - 通貨: JPY
4. 商品を保存し、**Price ID**をメモ（例: `price_xxxxxxxxxxxxx`）

### 1.3 Webhookエンドポイントの設定
1. Stripeダッシュボードで「開発者」→「Webhook」をクリック
2. 「エンドポイントを追加」をクリック
3. エンドポイントURL:
   - 開発環境: `https://your-ngrok-url.ngrok.io/webhooks/stripe`
   - 本番環境: `https://your-domain.com/webhooks/stripe`
4. 以下のイベントを選択:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
5. エンドポイントを保存し、**Webhook署名シークレット**をメモ（例: `whsec_xxxxxxxxxxxxx`）

### 1.4 APIキーの取得
1. Stripeダッシュボードで「開発者」→「APIキー」をクリック
2. 以下をメモ:
   - **公開可能キー** (Publishable key): `pk_test_xxxxxxxxxxxxx`
   - **シークレットキー** (Secret key): `sk_test_xxxxxxxxxxxxx`

## 2. バックエンドの環境変数設定

### 2.1 Rails Credentials への追加

```bash
cd backend
EDITOR="code --wait" bin/rails credentials:edit
```

以下を追加:

```yaml
stripe:
  secret_key: sk_test_xxxxxxxxxxxxx
  publishable_key: pk_test_xxxxxxxxxxxxx
  webhook_secret: whsec_xxxxxxxxxxxxx
  monthly_price_id: price_xxxxxxxxxxxxx
```


## 3. フロントエンドの環境変数設定

### 3.1 環境変数ファイルの作成

```bash
# frontend/.env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

**重要**: `NEXT_PUBLIC_`プレフィックスを必ず付けてください。これによりクライアントサイドでも利用可能になります。

## 4. 開発環境でのWebhookテスト

### 4.1 Stripe CLIのインストール

```bash
# macOS
brew install stripe/stripe-cli/stripe

# その他のOS
# https://stripe.com/docs/stripe-cli を参照
```

### 4.2 Stripe CLIでログイン

```bash
stripe login
```

### 4.3 Webhookの転送

開発サーバーを起動した状態で、別のターミナルで以下を実行:

```bash
stripe listen --forward-to localhost:3000/webhooks/stripe
```

これにより、StripeのWebhookイベントがローカル環境に転送されます。

## 5. 動作確認

### 5.1 サーバーの起動

```bash
# バックエンド
cd backend
docker-compose up

# フロントエンド
cd frontend
npm run dev
```

### 5.2 テスト手順

1. http://localhost:8200/mypage/subscription にアクセス
2. 「今すぐ有料会員になる」ボタンをクリック
3. Stripe Checkoutページに遷移することを確認
4. テストカード番号を使用して決済:
   - カード番号: `4242 4242 4242 4242`
   - 有効期限: 任意の未来の日付
   - CVC: 任意の3桁
   - 郵便番号: 任意
5. 決済完了後、マイページに戻ることを確認
6. 有料会員ステータスが表示されることを確認

### 5.3 解約のテスト

1. サブスクリプションページで「サブスクリプションを解約」をクリック
2. 解約確認モーダルで「解約する」をクリック
3. 解約が成功することを確認

## 6. 本番環境へのデプロイ

### 6.1 本番用のStripe設定

1. Stripeダッシュボードで本番モードに切り替え
2. 本番用の商品とプライスを作成
3. 本番用のWebhookエンドポイントを設定
4. 本番用のAPIキーを取得

### 6.2 環境変数の更新

本番環境の環境変数を本番用のキーに更新してください。

**重要**: 本番用のシークレットキーは絶対に公開しないでください。

## 7. トラブルシューティング

### Webhookが動作しない

- Webhook署名シークレットが正しく設定されているか確認
- エンドポイントURLが正しいか確認
- Stripeダッシュボードで「最近のイベント」を確認し、エラーがないか確認

### 決済が完了してもユーザー情報が更新されない

- Webhookログを確認
- `backend/log/development.log`でエラーを確認
- データベースのトランザクションが正常に完了しているか確認

### Stripe Checkoutに遷移できない

- フロントエンドの環境変数が正しく設定されているか確認
- ブラウザのコンソールでエラーを確認
- GraphQLのレスポンスを確認

## 8. セキュリティ上の注意事項

1. **シークレットキーの管理**
   - Gitにコミットしない
   - 環境変数またはRails Credentialsで管理
   - 定期的にローテーション

2. **Webhook署名の検証**
   - 必ず署名を検証してから処理を行う
   - 実装済み（`Stripe::WebhookHandler`で自動検証）

3. **HTTPSの使用**
   - 本番環境では必ずHTTPSを使用
   - WebhookエンドポイントもHTTPS必須

## 9. 参考リンク

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Ruby SDK](https://github.com/stripe/stripe-ruby)
- [Stripe.js Documentation](https://stripe.com/docs/js)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
