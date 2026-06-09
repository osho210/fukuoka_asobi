# お問い合わせメール送信機能 テストガイド

このガイドでは、お問い合わせメール送信機能の動作確認方法を説明します。

## 開発環境でのテスト

### 前提条件

1. Docker と Docker Compose がインストールされている
2. リポジトリをクローン済み
3. 必要な環境変数が設定されている

### 手順

#### 1. 環境変数の設定（オプション）

開発環境ではデフォルト値が使用されますが、カスタマイズする場合は `backend/.env` ファイルを作成します：

```bash
# backend/.env
DEFAULT_FROM_EMAIL=noreply@fukuoka-asobi.com
CONTACT_RECEIVER_EMAIL=fukuoka.asobi.nikki@gmail.com
CONTACT_AUTO_REPLY_ENABLED=true
```

#### 2. バックエンドの起動

```bash
# リポジトリルートから
docker-compose up -d

# ログを確認
docker-compose logs -f backend
```

#### 3. フロントエンドの起動

```bash
# 別のターミナルで
npm run dev:frontend
```

#### 4. GraphQL型の生成

バックエンドが起動したら、GraphQL型を生成します：

```bash
# フロントエンドのワークスペースで
cd frontend
npm run generate

# または、ルートから
npm run generate -w frontend
```

#### 5. お問い合わせフォームにアクセス

ブラウザで http://localhost:8200/contact にアクセスします。

#### 6. フォームに入力して送信

1. お名前: テスト太郎
2. メールアドレス: test@example.com
3. 件名: テスト送信
4. お問い合わせ種別: 一般的なお問い合わせ
5. お問い合わせ内容: これはテスト送信です。
6. プライバシーポリシーに同意: チェック

「送信する」ボタンをクリックします。

#### 7. メールの確認

送信後、以下のURLでメールを確認できます：

```
http://localhost:3000/letter_opener
```

以下の2通のメールが届いているはずです：
- 管理者宛: お問い合わせ通知
- 送信者宛: 自動返信メール

### バリデーションのテスト

以下のケースでエラーメッセージが表示されることを確認してください：

1. **必須項目の未入力**
   - いずれかの項目を空にして送信
   - エラー: 「〇〇を入力してください。」

2. **メールアドレスの形式エラー**
   - 不正なメール形式（例: `invalid-email`）を入力
   - エラー: 「メールアドレスの形式が正しくありません。」

3. **プライバシーポリシー未同意**
   - チェックボックスをオフにして送信
   - エラー: 「プライバシーポリシーに同意してください。」

4. **文字数制限オーバー**
   - お名前: 101文字以上
   - 件名: 201文字以上
   - お問い合わせ内容: 5001文字以上
   - 該当するエラーメッセージが表示される

### GraphQL のテスト（GraphiQL）

GraphiQL UI を使用して、mutation を直接テストすることもできます。

1. http://localhost:3000/graphiql にアクセス
2. 以下のミューテーションを実行：

```graphql
mutation {
  sendContactMessage(
    input: {
      name: "テスト太郎"
      email: "test@example.com"
      subject: "テスト送信"
      category: "general"
      message: "これはテスト送信です。"
      privacyAccepted: true
    }
  ) {
    success
    errors
  }
}
```

3. 結果を確認：
```json
{
  "data": {
    "sendContactMessage": {
      "success": true,
      "errors": []
    }
  }
}
```

## 本番環境でのテスト

### 前提条件

1. SMTP サーバーの認証情報を取得済み（Gmail / AWS SES / SendGrid など）
2. 必要な環境変数を設定済み

### Gmail SMTP の設定例

#### 1. Google アプリパスワードの取得

1. Googleアカウントの2段階認証を有効化
2. https://myaccount.google.com/apppasswords にアクセス
3. 「アプリを選択」→「その他（カスタム名）」→「福岡遊び日記」
4. 生成されたパスワードをコピー

#### 2. 環境変数の設定

本番環境に以下の環境変数を設定します：

```bash
# メール基本設定
DEFAULT_FROM_EMAIL=noreply@fukuoka-asobi.com
CONTACT_RECEIVER_EMAIL=fukuoka.asobi.nikki@gmail.com
CONTACT_AUTO_REPLY_ENABLED=true

# Gmail SMTP設定
SMTP_ADDRESS=smtp.gmail.com
SMTP_PORT=587
SMTP_DOMAIN=fukuoka-asobi.com
SMTP_USERNAME=fukuoka.asobi.nikki@gmail.com
SMTP_PASSWORD=<生成したアプリパスワード>
SMTP_AUTHENTICATION=plain
SMTP_ENABLE_STARTTLS_AUTO=true
```

#### 3. デプロイして動作確認

1. 本番環境にデプロイ
2. お問い合わせフォームから送信
3. 管理者メールアドレスにメールが届くことを確認
4. 送信者のメールアドレスに自動返信が届くことを確認

### トラブルシューティング

#### メールが送信されない

1. **環境変数の確認**
   ```bash
   # Railsコンソールで確認
   docker exec -it fukuoka_asobi_backend bin/rails console
   > ENV['DEFAULT_FROM_EMAIL']
   > ENV['CONTACT_RECEIVER_EMAIL']
   > ENV['SMTP_ADDRESS']
   ```

2. **SMTP認証情報の確認**
   - ユーザー名とパスワードが正しいか
   - アプリパスワードを使用しているか（Gmailの場合）

3. **Railsログの確認**
   ```bash
   docker-compose logs -f backend
   # または
   tail -f backend/log/development.log
   ```

4. **letter_opener_web が動作しているか確認**
   ```bash
   curl http://localhost:3000/letter_opener
   ```

#### メールが届かない

1. **スパムフォルダを確認**
2. **送信元ドメインの確認**
   - 本番環境では実在するドメインを使用
   - SPF、DKIM、DMARC レコードの設定を推奨
3. **SMTP サーバーの送信制限**
   - Gmail: 1日500通程度の制限あり
   - 大量送信が必要な場合は AWS SES や SendGrid を検討

#### GraphQL エラー

1. **ブラウザのコンソールを確認**
   - 開発者ツール（F12）→ Console タブ
   - Network タブで GraphQL リクエスト/レスポンスを確認

2. **バックエンドのログを確認**
   ```bash
   docker-compose logs backend | grep -i error
   ```

## 自動テスト

### バックエンド

RSpec テストを追加する場合：

```bash
cd backend
bundle exec rspec spec/mailers/contact_mailer_spec.rb
bundle exec rspec spec/graphql/mutations/send_contact_message_spec.rb
```

### フロントエンド

Vitest テストを追加する場合：

```bash
npm test -w frontend -- src/app/contact
```

## CI/CD でのテスト

GitHub Actions でのテスト実行：

```bash
# バックエンド
cd backend
bin/rubocop app/mailers/ app/graphql/mutations/send_contact_message.rb
bin/rails db:test:prepare test test:system

# フロントエンド
npm run lint:frontend
npm test -w frontend
```

## チェックリスト

- [ ] 開発環境でフォーム送信が成功する
- [ ] letter_opener_web で管理者宛メールが確認できる
- [ ] letter_opener_web で自動返信メールが確認できる
- [ ] 必須項目未入力時にエラーメッセージが表示される
- [ ] メールアドレス形式エラー時にエラーメッセージが表示される
- [ ] プライバシーポリシー未同意時にエラーメッセージが表示される
- [ ] 文字数制限を超えた場合にエラーメッセージが表示される
- [ ] GraphiQL で mutation が実行できる
- [ ] ESLint でエラーが出ない
- [ ] 本番環境で実際にメールが送信される
- [ ] 送信者に自動返信が届く

## 関連ドキュメント

- [お問い合わせメール送信機能設計書](./contact_mail_design.md)
- [README - 環境変数設定](../README.md#%E7%92%B0%E5%A2%83%E5%A4%89%E6%95%B0%E8%A8%AD%E5%AE%9A)
