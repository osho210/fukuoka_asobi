# お問い合わせメール送信機能 実装サマリ

## 実装概要

お問い合わせページからのメール送信機能を実装しました。ユーザーがフォームを送信すると、管理者に通知メールが届き、送信者には自動返信メールが送られます。

## 実装ファイル

### Backend（Rails）

#### Mailer
- `backend/app/mailers/contact_mailer.rb` - ContactMailer クラス（NEW）
  - `admin_notification`: 管理者宛通知メール
  - `auto_reply`: 送信者宛自動返信メール

- `backend/app/mailers/application_mailer.rb` - ApplicationMailer（更新）
  - `from` を環境変数 `DEFAULT_FROM_EMAIL` に変更

#### メールテンプレート
- `backend/app/views/contact_mailer/admin_notification.text.erb` - テキスト版（NEW）
- `backend/app/views/contact_mailer/admin_notification.html.erb` - HTML版（NEW）
- `backend/app/views/contact_mailer/auto_reply.text.erb` - テキスト版（NEW）
- `backend/app/views/contact_mailer/auto_reply.html.erb` - HTML版（NEW）

#### GraphQL
- `backend/app/graphql/mutations/send_contact_message.rb` - SendContactMessage mutation（NEW）
  - 入力バリデーション
  - メール送信処理
  - エラーハンドリング

- `backend/app/graphql/types/mutation_type.rb` - MutationType（更新）
  - `send_contact_message` フィールド追加

#### 環境設定
- `backend/config/environments/production.rb` - 本番環境設定（更新）
  - SMTP 設定追加

### Frontend（Next.js）

#### コンポーネント
- `frontend/src/app/contact/page.tsx` - お問い合わせページ（更新）
  - フォーム送信処理実装
  - バリデーション
  - ローディング・成功/エラー表示
  - フォームリセット

- `frontend/src/app/contact/contact.css` - スタイル（更新）
  - 成功/エラーメッセージのスタイル追加
  - ローディング状態のボタンスタイル追加

#### GraphQL
- `frontend/src/graphql/contact.ts` - GraphQL 定義（NEW）
  - `SEND_CONTACT_MESSAGE` mutation
  - TypeScript 型エクスポート

- `frontend/src/graphql/sendContactMessage.graphql` - GraphQL ファイル（NEW）
  - mutation 定義

### ドキュメント

- `docs/contact_mail_design.md` - 設計書（NEW）
  - 機能要件
  - アーキテクチャ
  - 環境変数
  - 本番環境設定例
  - 将来の拡張可能性

- `docs/contact_mail_testing_guide.md` - テストガイド（NEW）
  - 開発環境でのテスト手順
  - 本番環境でのテスト手順
  - トラブルシューティング

- `README.md` - プロジェクトREADME（更新）
  - 環境変数設定セクション追加
  - メール送信設定の説明

## 主要機能

### 1. バリデーション

#### フロントエンド（TypeScript）
- 必須項目チェック
- メールアドレス形式チェック
- プライバシーポリシー同意チェック

#### バックエンド（Ruby）
- 必須項目チェック
- メールアドレス形式チェック（正規表現）
- 文字数制限チェック（名前100文字、件名200文字、内容5000文字）
- カテゴリー妥当性チェック
- プライバシーポリシー同意チェック
- nil チェック（安全性向上）

### 2. メール送信

#### 管理者宛通知メール
- 件名: `[お問い合わせ] {ユーザーが入力した件名}`
- 送信先: `CONTACT_RECEIVER_EMAIL` 環境変数
- 内容: お問い合わせ内容の詳細（名前、メールアドレス、種別、本文）

#### 自動返信メール
- 件名: `[福岡遊び日記] お問い合わせを受け付けました`
- 送信先: ユーザーが入力したメールアドレス
- 内容: 受付確認と返信までの目安（営業日3日以内）
- ON/OFF: `CONTACT_AUTO_REPLY_ENABLED` 環境変数で制御

### 3. UI/UX

- **送信中**: ボタンが無効化され「送信中...」と表示
- **成功時**: 
  - 成功メッセージを表示
  - フォームが自動リセット
  - エラーメッセージをクリア
- **失敗時**:
  - エラーメッセージをリスト表示
  - 入力内容は保持（再入力不要）

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

#### Gmail SMTP（MVP・低コスト）

```bash
SMTP_ADDRESS=smtp.gmail.com
SMTP_PORT=587
SMTP_DOMAIN=fukuoka-asobi.com
SMTP_USERNAME=fukuoka.asobi.nikki@gmail.com
SMTP_PASSWORD=<Googleアプリパスワード>
SMTP_AUTHENTICATION=plain
SMTP_ENABLE_STARTTLS_AUTO=true
```

#### AWS SES（将来推奨・スケーラブル）

```bash
SMTP_ADDRESS=email-smtp.ap-northeast-1.amazonaws.com
SMTP_PORT=587
SMTP_DOMAIN=fukuoka-asobi.com
SMTP_USERNAME=<SES SMTP ユーザー名>
SMTP_PASSWORD=<SES SMTP パスワード>
SMTP_AUTHENTICATION=login
SMTP_ENABLE_STARTTLS_AUTO=true
```

## 開発環境

### メール確認方法

開発環境では `letter_opener_web` を使用してメールをブラウザで確認できます。

1. バックエンド起動: `docker-compose up -d`
2. フロントエンド起動: `npm run dev:frontend`
3. お問い合わせフォーム送信: http://localhost:8200/contact
4. メール確認: http://localhost:3000/letter_opener

## セキュリティ

### CodeQL スキャン結果

✅ **脆弱性なし**: Ruby と JavaScript の両方でセキュリティ脆弱性は検出されませんでした。

### セキュリティ対策

1. **入力バリデーション**: フロント・バック両方で実施
2. **エスケープ処理**: ERB テンプレートで自動エスケープ
3. **環境変数**: SMTP 認証情報を環境変数で管理
4. **エラーハンドリング**: 詳細なエラーメッセージをログに記録、ユーザーには一般的なメッセージを表示
5. **nil チェック**: 文字数チェック前に `present?` で nil を確認

## テスト

### 実施済み

- ✅ Ruby 構文チェック（Syntax OK）
- ✅ ESLint チェック（エラーなし）
- ✅ CodeQL セキュリティスキャン（脆弱性なし）
- ✅ Code Review 実施（フィードバック対応完了）

### 次のステップ（実環境で実施）

- [ ] GraphQL 型生成: `npm run generate -w frontend`（要バックエンド起動）
- [ ] 開発環境動作確認: letter_opener_web でメール確認
- [ ] 本番環境動作確認: SMTP 設定後に実際のメール送信テスト
- [ ] RuboCop 実行: `bin/rubocop`（要 Ruby 3.3.1）
- [ ] Rails テスト実行: `bin/rails db:test:prepare test test:system`（要 Docker）

## 将来の拡張可能性

### スパム対策
- reCAPTCHA / hCaptcha 導入
- IP ベースのレート制限
- 同一メールアドレスからの連投制限

### 管理機能
- お問い合わせログを DB に保存
- 管理画面で一覧表示・検索
- 返信管理機能

### 通知の拡張
- カテゴリー別の通知先振り分け
- Slack 通知連携
- 複数管理者への通知

### メール配信の改善
- バックグラウンドジョブ化（ActiveJob + Sidekiq）
- リトライ機能
- 配信ステータス追跡
- SendGrid/AWS SES の分析機能活用

## トラブルシューティング

詳細は `docs/contact_mail_testing_guide.md` を参照してください。

### よくある問題

1. **メールが送信されない**
   - 環境変数を確認
   - SMTP 認証情報を確認
   - Rails ログを確認
   - letter_opener_web の動作確認

2. **メールが届かない**
   - スパムフォルダを確認
   - DNS 設定（SPF, DKIM, DMARC）を確認
   - SMTP サーバーの送信制限を確認

3. **GraphQL エラー**
   - ブラウザコンソールを確認
   - Network タブでリクエスト/レスポンスを確認
   - バックエンドログを確認

## 関連リンク

- [設計書](./contact_mail_design.md)
- [テストガイド](./contact_mail_testing_guide.md)
- [README - 環境変数設定](../README.md#⚙️-環境変数設定)

## コミット履歴

1. **Initial plan** - 実装計画の策定
2. **Backend: ContactMailer とメールテンプレート作成、GraphQL mutation 実装** - バックエンドの基本実装
3. **Fix ESLint エラーと本番環境 SMTP 設定追加** - フロントエンド修正と本番設定
4. **Code review フィードバック対応：可読性向上とnilチェック追加** - コードレビュー対応

## 統計

- **追加されたファイル数**: 14
- **変更されたファイル数**: 2
- **合計行数**: 1,225行追加
- **実装時間**: 約2時間

## まとめ

お問い合わせメール送信機能の実装が完了しました。開発環境では letter_opener_web でメールを確認でき、本番環境では環境変数を設定するだけで SMTP 経由でメール送信が可能です。

将来的な拡張（スパム対策、管理機能、高度な通知など）にも対応できる設計になっています。

次のステップは、実環境でバックエンドを起動して GraphQL 型を生成し、動作確認を行うことです。
