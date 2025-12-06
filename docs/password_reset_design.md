# パスワードリセット機能 設計書（アーカイブ）

## 現行方針

- このプロジェクトの認証は **Google 認証（OAuth 2.0）のみをサポート** しています。パスワード認証は廃止されており、パスワードを用いたサインイン／リセット機能は運用対象外です。
- 本文は **パスワード認証を提供していた頃の設計メモとして残すアーカイブ** です。実装を行わないよう注意してください。

## 要件定義（アーカイブ）

### 目的
ユーザーがパスワードを忘れた場合に、登録済みのメールアドレス宛にパスワード再設定用のリンクを送信し、パスワードを再設定できるようにする。

### 対象画面
- `/forgot-password`：パスワードリセット用のメールアドレス入力フォーム
- `/reset-password?token=xxxxx`：パスワード再設定画面（メールリンクから遷移）

### 前提技術
- フロントエンド：Next.js（App Router構成）
- バックエンド：Ruby on Rails（APIモード）
- メール送信：ActionMailer
- 開発環境の確認手段：`letter_opener` を使用

### 処理の流れ
1. ユーザーが `/forgot-password` にアクセスし、登録済みメールアドレスを入力
2. フロントエンドからバックエンドAPI（`POST /api/password/forgot`）へリクエストを送信
3. Rails側でユーザーを検索し、トークンと有効期限をDBに保存
4. ActionMailer を使ってパスワード再設定用リンクを生成し、開発環境では `letter_opener` 経由で表示
5. ユーザーがメール内のリンクをクリックすると、再設定画面（`/reset-password`）に遷移
6. 新しいパスワードを入力し、フロントエンドから `POST /api/password/reset` にリクエスト
7. Rails側でトークンを検証 → パスワードを更新し、トークンを無効化

### セキュリティ要件
- 存在しないメールアドレスに対しても「メールを送信しました」と表示し、ユーザー情報の漏洩を防止
- リセットトークンの有効期限を2時間に設定
- パスワード更新後はトークンを再利用不可にする

## 設計（アーカイブ）

### データベース設計

#### パスワードリセットトークンテーブル追加
Userモデルに以下のカラムを追加：

```ruby
# db/migrate/YYYYMMDDHHMMSS_add_password_reset_to_users.rb
class AddPasswordResetToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :reset_password_token, :string
    add_column :users, :reset_password_sent_at, :datetime
    add_index :users, :reset_password_token, unique: true
  end
end
```

### バックエンドAPI設計

#### パスワードリセットリクエスト
- エンドポイント: `POST /api/password/forgot`
- リクエストパラメータ: `{ email: string }`
- レスポンス: `{ success: boolean, message: string }`

#### パスワードリセット実行
- エンドポイント: `POST /api/password/reset`
- リクエストパラメータ: `{ token: string, password: string, password_confirmation: string }`
- レスポンス: `{ success: boolean, message: string }`

### フロントエンド設計

#### パスワードリセットリクエスト画面 (`/forgot-password`)
- メールアドレス入力フォーム
- 送信ボタン
- 送信後のメッセージ表示

#### パスワードリセット実行画面 (`/reset-password`)
- トークンの検証（URLパラメータから取得）
- 新しいパスワード入力フォーム
- パスワード確認入力フォーム
- 送信ボタン
- 送信後のメッセージ表示

### メール設計
- 件名: 「【福岡遊び】パスワード再設定のご案内」
- 本文: パスワード再設定用のリンクと有効期限の案内
- フォーマット: HTML/テキスト両方対応

## 実装計画（アーカイブ）

### バックエンド実装
1. Gemfileに `letter_opener` を追加
2. 開発環境設定の更新
3. マイグレーションファイルの作成と実行
4. パスワードリセットコントローラーの実装
5. パスワードリセットメーラーの実装
6. ルーティングの設定
7. テストの実装

### フロントエンド実装
1. パスワードリセットリクエストページの実装
2. パスワードリセット実行ページの実装
3. APIクライアントの実装
4. バリデーションの実装
5. エラーハンドリングの実装
6. UIデザインの適用
