# お問い合わせメール送信機能設計書

## 概要

お問い合わせページからのメッセージを管理者に通知し、送信者に自動返信メールを送る機能です。

## 機能要件

### 1. お問い合わせフォーム送信

- ユーザーが必要情報を入力してフォーム送信
- バリデーション（フロント・バック両方）
- 送信成功/失敗のフィードバック

### 2. 管理者通知メール

- お問い合わせ内容を管理者に送信
- 送信先: `CONTACT_RECEIVER_EMAIL` 環境変数で指定

### 3. 自動返信メール

- 送信者にお問い合わせ受付確認メールを送信
- ON/OFF切替: `CONTACT_AUTO_REPLY_ENABLED` 環境変数で制御

## アーキテクチャ

### Backend (Rails)

#### Mailer

**ContactMailer** (`app/mailers/contact_mailer.rb`)

- `admin_notification`: 管理者宛通知メール
- `auto_reply`: 送信者宛自動返信メール

#### GraphQL Mutation

**SendContactMessage** (`app/graphql/mutations/send_contact_message.rb`)

入力:
- `name`: String (必須, 最大100文字)
- `email`: String (必須, メール形式)
- `subject`: String (必須, 最大200文字)
- `category`: String (必須, 以下のいずれか)
  - `general`: 一般的なお問い合わせ
  - `business`: ビジネスに関するお問い合わせ
  - `media`: メディア掲載について
  - `error`: サイトのエラー報告
  - `other`: その他
- `message`: String (必須, 最大5000文字)
- `privacy_accepted`: Boolean (必須, true)

出力:
- `success`: Boolean
- `errors`: [String]

バリデーション:
- 必須項目チェック
- メールアドレス形式チェック
- 文字数制限チェック
- カテゴリー妥当性チェック
- プライバシーポリシー同意チェック

### Frontend (Next.js)

#### GraphQL Query

**sendContactMessage.graphql** (`frontend/src/graphql/sendContactMessage.graphql`)

```graphql
mutation SendContactMessage(
  $name: String!
  $email: String!
  $subject: String!
  $category: String!
  $message: String!
  $privacyAccepted: Boolean!
) {
  sendContactMessage(
    input: {
      name: $name
      email: $email
      subject: $subject
      category: $category
      message: $message
      privacyAccepted: $privacyAccepted
    }
  ) {
    success
    errors
  }
}
```

#### Contact Page

**page.tsx** (`frontend/src/app/contact/page.tsx`)

フォーム処理:
- バリデーション
- ローディング表示
- 成功時: 成功メッセージ表示 + フォームリセット
- 失敗時: エラーメッセージ表示

## 環境変数

### 必須

```bash
# メール送信元アドレス
DEFAULT_FROM_EMAIL=noreply@fukuoka-asobi.com

# お問い合わせ受信先（管理者メールアドレス）
CONTACT_RECEIVER_EMAIL=fukuoka.asobi.nikki@gmail.com
```

### オプション

```bash
# 自動返信メール有効化（デフォルト: true）
CONTACT_AUTO_REPLY_ENABLED=true
```

### SMTP設定（本番環境）

```bash
# SMTP サーバー設定
SMTP_ADDRESS=smtp.gmail.com
SMTP_PORT=587
SMTP_DOMAIN=fukuoka-asobi.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_AUTHENTICATION=plain
SMTP_ENABLE_STARTTLS_AUTO=true
```

## 開発環境

### メール確認方法

開発環境では `letter_opener_web` を使用してメールをブラウザで確認できます。

1. アプリケーション起動
2. お問い合わせフォームから送信
3. `http://localhost:3000/letter_opener` でメール確認

## 本番環境

### SMTP設定例

#### Gmail SMTP (MVP)

```bash
SMTP_ADDRESS=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=fukuoka.asobi.nikki@gmail.com
SMTP_PASSWORD=your-app-password  # Googleアプリパスワード
SMTP_AUTHENTICATION=plain
SMTP_ENABLE_STARTTLS_AUTO=true
```

注意:
- Googleアカウントで2段階認証を有効化
- アプリパスワードを生成して使用
- 1日の送信制限あり（~500通）

#### AWS SES (将来推奨)

```bash
SMTP_ADDRESS=email-smtp.ap-northeast-1.amazonaws.com
SMTP_PORT=587
SMTP_USERNAME=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
SMTP_AUTHENTICATION=login
SMTP_ENABLE_STARTTLS_AUTO=true
```

メリット:
- 低コスト（$0.10/1000通）
- 高い送信制限
- スケーラブル

#### SendGrid (代替案)

```bash
SMTP_ADDRESS=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_AUTHENTICATION=plain
SMTP_ENABLE_STARTTLS_AUTO=true
```

メリット:
- 無料枠あり（100通/日）
- 使いやすい管理画面
- メール配信分析機能

## テスト

### Backend

```bash
cd backend
bundle exec rspec spec/mailers/contact_mailer_spec.rb
bundle exec rspec spec/graphql/mutations/send_contact_message_spec.rb
```

### Frontend

```bash
npm test -w frontend -- src/app/contact
```

## 将来の拡張可能性

### 1. スパム対策

- reCAPTCHA / hCaptcha 導入
- IPベースのレート制限
- 同一メールアドレスからの連投制限

### 2. 管理画面

- お問い合わせログをDBに保存
- 管理画面で一覧表示・検索・返信管理

### 3. 通知の拡張

- カテゴリー別の通知先振り分け
- Slack通知連携
- 複数管理者への通知

### 4. メール配信の改善

- バックグラウンドジョブ化（ActiveJob）
- リトライ機能
- 配信ステータス追跡

## トラブルシューティング

### メールが送信されない

1. 環境変数が正しく設定されているか確認
2. SMTP認証情報が正しいか確認
3. Railsログでエラーメッセージを確認
4. letter_opener_web でローカル確認

### メールが届かない

1. スパムフォルダを確認
2. 送信元ドメインのDNS設定（SPF, DKIM, DMARC）を確認
3. SMTPサーバーの送信制限を確認

### バリデーションエラー

1. ブラウザコンソールでGraphQLレスポンスを確認
2. エラーメッセージを確認して対応

## 関連ファイル

### Backend
- `app/mailers/contact_mailer.rb`
- `app/mailers/application_mailer.rb`
- `app/graphql/mutations/send_contact_message.rb`
- `app/views/contact_mailer/admin_notification.{text,html}.erb`
- `app/views/contact_mailer/auto_reply.{text,html}.erb`
- `config/environments/development.rb`
- `config/environments/production.rb`

### Frontend
- `frontend/src/app/contact/page.tsx`
- `frontend/src/graphql/sendContactMessage.graphql`

### Docs
- `docs/contact_mail_design.md`
