# 管理画面の認証・認可機能実装ドキュメント

## 概要

管理画面（admin）に Google OAuth 2.0 認証を導入し、`admin` 権限を持つユーザーのみがアクセスできるようにしました。

## 実装内容

### 1. Frontend (admin) - 認証機能

#### ログイン画面
- **ファイル**: `admin/src/components/auth/Login.tsx`, `admin/src/app/login/page.tsx`
- **機能**:
  - Google Sign-in による認証
  - admin 権限チェック（一般ユーザーはアクセス拒否）
  - ログイン成功時にダッシュボードへリダイレクト
  - エラーメッセージ表示

#### 認証プロバイダー
- **ファイル**: `admin/src/components/auth/AuthProvider.tsx`
- **機能**:
  - クライアントサイドでの認証状態確認
  - `currentUser` GraphQL クエリの実行
  - 未認証ユーザーをログイン画面へリダイレクト
  - admin 権限のないユーザーをログイン画面へリダイレクト
  - ログインページでは認証チェックをスキップ

#### ログアウト機能
- **ファイル**: `admin/src/components/auth/LogoutButton.tsx`
- **機能**:
  - `userLogout` mutation の実行
  - Cookie のクリア
  - ログイン画面へリダイレクト

#### GraphQL 設定
- **ファイル**: `admin/src/components/ApolloWrapper.tsx`
- **変更内容**: `credentials: 'include'` を追加（Cookie 認証のため）
- **クエリ/ミューテーション**:
  - `admin/src/graphql/queries/getCurrentUser.ts`: ログインユーザー情報取得
  - `admin/src/graphql/mutations/userLogout.ts`: ログアウト処理

### 2. Backend - 認可機能

#### 権限チェックの有効化
- **対象ファイル**: 33個の mutation ファイル
- **変更内容**: コメントアウトされていた権限チェックを有効化

```ruby
# 変更前
# unless context[:current_user]&.admin?
#   return { model: nil, errors: ["管理者権限が必要です"] }
# end

# 変更後
unless context[:current_user]&.admin?
  return { model: nil, errors: ["管理者権限が必要です"] }
end
```

#### 対象 mutations
- **create mutations**: area, category, district, event, hashtag, magazine, menu, news, purpose, recommended_for, spot, spot_ambiance
- **update mutations**: area, category, district, event, hashtag, magazine, menu, news, purpose, recommended_for, spot, spot_ambiance, station
- **delete mutations**: area, category, district, hashtag, menu, purpose, recommended_for, spot_ambiance, station

## 技術仕様

### 認証フロー

1. **ユーザーがログイン画面にアクセス**
   - Google OAuth Client ID: `NEXT_PUBLIC_GOOGLE_CLIENT_ID` を使用

2. **Google Sign-in ボタンをクリック**
   - Google OAuth 認証ダイアログが表示される

3. **認証成功後、`userGoogleAuth` mutation を実行**
   - Google ID Token をバックエンドに送信
   - User を検索または作成
   - JWT トークンを生成
   - 暗号化 cookie `fukuoka_asobi_auth_token` に保存

4. **admin 権限チェック**
   - `user.role === 'admin'` であることを確認
   - 権限がない場合はエラーメッセージを表示

5. **ダッシュボードにリダイレクト**
   - 認証成功時は `/` にリダイレクト

### 認可チェック

#### Frontend
- **AuthProvider** が各ページで認証状態を確認
- `currentUser` GraphQL クエリで現在のユーザー情報を取得
- `user.role !== 'admin'` の場合はログイン画面にリダイレクト

#### Backend
- 各 mutation の `resolve` メソッド開始時に権限チェック
- `context[:current_user]&.admin?` で admin 権限を確認
- 権限がない場合は `{ model: nil, errors: ["管理者権限が必要です"] }` を返却

### Cookie 認証

- **Cookie 名**: `fukuoka_asobi_auth_token`
- **暗号化**: Rails の `cookies.encrypted` を使用
- **有効期限**: 6ヶ月
- **HTTPOnly**: true（XSS 攻撃対策）
- **Secure**: production 環境のみ true
- **SameSite**: lax

## セキュリティ

### 実装済みの対策

1. **JWT トークンの検証**
   - JWT secret key を使用した署名検証
   - JTI（JWT ID）の照合

2. **権限チェック**
   - Frontend: クライアントサイドで認証状態確認
   - Backend: サーバーサイドで admin 権限確認

3. **Cookie セキュリティ**
   - HTTPOnly フラグで XSS 対策
   - Secure フラグで HTTPS 通信のみ許可（production）
   - 暗号化 cookie で改ざん防止

4. **CSRF 対策**
   - GraphQL endpoint で CSRF token チェックをスキップ
   - Cookie の SameSite 属性で CSRF 軽減

### CodeQL スキャン結果

- **JavaScript**: 脆弱性なし ✅
- **Ruby**: 脆弱性なし ✅

## 使用方法

### 管理者としてログイン

1. 管理画面 URL にアクセス（例: `http://localhost:9200`）
2. 自動的にログイン画面にリダイレクト
3. 「Googleでログイン」ボタンをクリック
4. Google アカウントで認証
5. admin 権限を持つユーザーの場合、ダッシュボードにリダイレクト
6. admin 権限がない場合、エラーメッセージが表示される

### ログアウト

1. サイドバーの「ログアウト」ボタンをクリック
2. 確認ダイアログで「OK」を選択
3. ログイン画面にリダイレクト

## テスト

### Frontend
- ✅ ESLint チェック: 合格
- ✅ TypeScript コンパイル: 合格

### Backend
- ✅ Ruby 構文チェック: 合格
- ✅ CodeQL セキュリティスキャン: 脆弱性なし

## 今後の課題

1. **E2E テスト**
   - ログインフローの自動テスト
   - 権限チェックの自動テスト

2. **より細かい権限制御**
   - `store_owner`, `editor` などの役割別権限
   - リソースレベルの権限制御（例: 自分の店舗のみ編集可能）

3. **監査ログ**
   - 管理画面での操作ログ記録
   - 不正アクセスの検出

## 参考資料

- [Google OAuth 実装詳細](./google_oauth_implementation_summary.md)
- [Google OAuth セットアップガイド](./google_oauth_setup.md)
- [Cookie 認証設計](./cookie_auth_design.md)
