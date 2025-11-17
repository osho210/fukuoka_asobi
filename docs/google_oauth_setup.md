# Google OAuth セットアップガイド

このドキュメントでは、Google OAuth認証を設定する手順を説明します。

## 1. Google Cloud Consoleでの設定

### 1.1 プロジェクトの作成または選択

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 既存のプロジェクトを選択するか、新しいプロジェクトを作成

### 1.2 OAuth同意画面の設定

1. 左側のメニューから「APIとサービス」→「OAuth同意画面」を選択
2. ユーザータイプを選択（内部または外部）
3. アプリ名、ユーザーサポートメール、デベロッパー連絡先を入力
4. スコープは必要に応じて設定（基本的には`email`と`profile`が必要）
5. 保存して次へ

### 1.3 認証情報の作成

1. 左側のメニューから「APIとサービス」→「認証情報」を選択
2. 「認証情報を作成」→「OAuthクライアントID」を選択
3. アプリケーションの種類：「ウェブアプリケーション」を選択
4. 名前を入力（例：「福岡遊び日記」）
5. 承認済みのJavaScript生成元を追加：
   - 開発環境：`http://localhost:8200`
   - 本番環境：`https://your-production-domain.com`
6. 承認済みのリダイレクトURIは設定不要（Google Sign-In SDKを使用するため）
7. 「作成」をクリック
8. 表示されるクライアントIDをコピー

## 2. バックエンド（Rails）の設定

### 2.1 Gemのインストール

Gemfileに以下を追加（すでに追加済み）：

```ruby
gem 'google-id-token'
```

インストール：

```bash
cd backend
bundle install
```

### 2.2 クレデンシャルの設定

開発環境のクレデンシャルを編集：

```bash
EDITOR="vim -f" bin/rails credentials:edit --environment development
```

以下を追加：

```yaml
google:
  client_id: your-google-client-id.apps.googleusercontent.com
```

本番環境も同様に設定：

```bash
EDITOR="vim -f" bin/rails credentials:edit --environment production
```

## 3. フロントエンド（Next.js）の設定

### 3.1 環境変数の設定

`frontend/.env.local`ファイルを作成：

```bash
cp frontend/.env.example frontend/.env.local
```

以下の値を設定：

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3000/graphql
```

本番環境では、Vercelなどのデプロイ環境で環境変数を設定してください。

## 4. 動作確認

### 4.1 開発環境での確認

1. バックエンドを起動：
   ```bash
   cd backend
   rails server
   ```

2. フロントエンドを起動：
   ```bash
   npm run dev:frontend
   ```

3. ブラウザで`http://localhost:8200/login`にアクセス
4. 「Googleでログイン」ボタンをクリック
5. Googleアカウントを選択してログイン
6. ログイン成功後、ホームページにリダイレクトされることを確認

## 5. トラブルシューティング

### エラー：「このアプリはGoogleで確認されていません」

- OAuth同意画面を「外部」に設定した場合、テストユーザーを追加する必要があります
- Google Cloud Console → OAuth同意画面 → テストユーザー → ユーザーを追加

### エラー：「認証に失敗しました」

- バックエンドのクレデンシャルにGoogle Client IDが正しく設定されているか確認
- フロントエンドの環境変数が正しく設定されているか確認
- バックエンドのログでエラー詳細を確認

### Google Sign-Inボタンが表示されない

- ブラウザのコンソールでJavaScriptエラーが出ていないか確認
- Google OAuth scriptが正しくロードされているか確認
- 環境変数`NEXT_PUBLIC_GOOGLE_CLIENT_ID`が設定されているか確認

## 6. 本番環境への適用

### Fly.io（バックエンド）

```bash
fly secrets set GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
```

または、credentials:editで本番環境のクレデンシャルに設定

### Vercel（フロントエンド）

1. Vercelのプロジェクト設定 → Environment Variables
2. 以下の変数を追加：
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - `NEXT_PUBLIC_GRAPHQL_ENDPOINT`

## 7. セキュリティ上の注意

- Client IDは公開情報として扱われるため、`.env.local`ファイルはGitにコミットしない
- `.gitignore`に`.env.local`が含まれていることを確認
- 本番環境のClient IDと開発環境のClient IDは別々に管理することを推奨
- 承認済みのJavaScript生成元は、実際に使用するドメインのみに限定する

## 8. 既存ユーザーの移行について

既存のパスワード認証ユーザーは、以下の手順で移行できます：

1. ユーザーが登録時に使用したメールアドレスと同じGoogleアカウントでログイン
2. システムが自動的に既存のアカウントに紐付け
3. 以降はGoogleアカウントでログイン可能

注：異なるメールアドレスのGoogleアカウントでログインした場合は新規ユーザーとして登録されます。
