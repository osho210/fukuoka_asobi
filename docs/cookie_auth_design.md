# Cookieベース ログイン状態管理 設計書

## 1. 要件定義

### 1.1 目的
- ユーザーのログイン状態をCookieで管理し、フロントエンドでの表示出し分けを可能にする
- ログイン済みユーザーと未ログインユーザーで異なるUIを提供する
- セキュアなCookie管理によりセッション情報を保護する

### 1.2 要件
- ログイン成功時にCookieを発行し、ユーザーIDを保存する
- ログアウト時にCookieを削除する
- HttpOnly属性を有効にし、JavaScriptからの読み取りを防止する
- 本番環境ではSecure属性を有効にし、HTTPSのみでCookieを送信する
- SameSite=Laxを設定し、CSRF攻撃を防止する
- Cookieに署名または暗号化を施し、改ざんを防止する
- Cookieの有効期限を7日間に設定する

### 1.3 非機能要件
- セキュリティ: CSRF対策、XSS対策、セッションハイジャック対策を実装
- パフォーマンス: Cookie管理による過度なサーバー負荷を避ける
- 保守性: 認証ロジックを集約し、変更容易性を確保する

## 2. 設計概要

### 2.1 アーキテクチャ概要
- バックエンド: Ruby on Rails (GraphQL API)
- フロントエンド: Next.js (TypeScript)
- 認証方式: Cookieベースのセッション管理

### 2.2 認証フロー
1. ユーザーがログインフォームから認証情報を送信
2. バックエンドでユーザー認証を実行
3. 認証成功時、署名付きCookieをレスポンスに含める
4. ブラウザがCookieを保存
5. 以降のリクエストでCookieが自動的に送信される
6. バックエンドでCookieを検証し、ユーザー情報を取得
7. フロントエンドでログイン状態に応じたUI表示

### 2.3 Cookie仕様
| 項目 | 内容 |
|------|------|
| Cookie名 | `fukuoka-asobi-user_id` |
| 値 | ログイン中のユーザーID |
| 保存タイミング | `/api/v1/login` 実行時（認証成功時） |
| 破棄タイミング | ログアウト処理実行時 `/api/v1/logout` |
| HttpOnly | ✅ 有効（JSから読み取れない） |
| Secure | ✅ 本番環境では必須（HTTPSのみ） |
| SameSite | Lax（CSRF対策） |
| Path | /（全体で有効） |
| Max-Age | 7日（604800秒） |
| 署名・暗号化 | ✅ サーバー側で署名済みCookieを使用 |

## 3. 機能設計

### 3.1 バックエンド実装

#### 3.1.1 認証コントローラー
Rails側でCookieを設定するためのコントローラーを実装します。GraphQLミューテーションからこのコントローラーのメソッドを呼び出します。

```ruby
# app/controllers/concerns/authentication.rb
module Authentication
  extend ActiveSupport::Concern

  def set_user_cookie(user)
    cookies.encrypted[:fukuoka_asobi_user_id] = {
      value: user.id,
      httponly: true,
      secure: Rails.env.production?,
      same_site: :lax,
      path: '/',
      expires: 7.days.from_now
    }
  end

  def clear_user_cookie
    cookies.delete(:fukuoka_asobi_user_id, path: '/')
  end

  def current_user_from_cookie
    user_id = cookies.encrypted[:fukuoka_asobi_user_id]
    User.find_by(id: user_id) if user_id
  end
end
```

#### 3.1.2 GraphQLコントローラー
GraphQLコントローラーに認証モジュールを組み込みます。

```ruby
# app/controllers/graphql_controller.rb
class GraphqlController < ApplicationController
  include Authentication

  # 既存のコード...

  def current_user
    @current_user ||= current_user_from_cookie
  end

  def execute
    # コンテキストにcurrent_userを追加
    context = {
      current_user: current_user,
      # その他のコンテキスト...
    }

    # 既存のexecuteコード...
  end
end
```

#### 3.1.3 ログインミューテーション
GraphQLのログインミューテーションを拡張して、Cookieを設定します。

```ruby
# app/graphql/mutations/user_login.rb
module Mutations
  class UserLogin < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true

    field :user, Types::UserType, null: true
    field :token, String, null: true
    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(email:, password:)
      user = User.find_by(email: email)

      if user&.valid_password?(password)
        # Cookieを設定
        context[:controller].send(:set_user_cookie, user)

        # レスポンス
        {
          user: user,
          token: generate_token(user),
          success: true,
          errors: []
        }
      else
        {
          user: nil,
          token: nil,
          success: false,
          errors: ["メールアドレスまたはパスワードが正しくありません"]
        }
      end
    end

    private

    def generate_token(user)
      # トークン生成ロジック（既存のものがあれば使用）
    end
  end
end
```

#### 3.1.4 ログアウトミューテーション
ログアウト時にCookieを削除するミューテーションを実装します。

```ruby
# app/graphql/mutations/user_logout.rb
module Mutations
  class UserLogout < BaseMutation
    field :success, Boolean, null: false

    def resolve
      # Cookieを削除
      context[:controller].send(:clear_user_cookie)

      { success: true }
    end
  end
end
```

#### 3.1.5 認証チェックリゾルバー
ログイン状態を確認するためのリゾルバーを実装します。

```ruby
# app/graphql/resolvers/current_user_resolver.rb
module Resolvers
  class CurrentUserResolver < BaseResolver
    type Types::UserType, null: true

    def resolve
      context[:current_user]
    end
  end
end
```

### 3.2 フロントエンド実装

#### 3.2.1 認証コンテキスト
Next.jsでログイン状態を管理するためのコンテキストを実装します。

```typescript
// src/lib/auth/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';

// GraphQLクエリ
const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      username
      email
      profileImageUrl
    }
  }
`;

// 型定義
type User = {
  id: string;
  username: string;
  email: string;
  profileImageUrl?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
};

// コンテキスト作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// プロバイダーコンポーネント
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const { data, loading, refetch } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.currentUser) {
        setUser(data.currentUser);
      } else {
        setUser(null);
      }
    },
    onError: () => {
      setUser(null);
    }
  });

  // ログアウト処理
  const logout = async () => {
    try {
      // ログアウトミューテーションを実行
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        await router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // ユーザー情報の再取得
  const refetchUser = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Error refetching user:', error);
    }
  };

  // 認証状態の値
  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// フック
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

#### 3.2.2 APIルート（Next.js）
Next.jsのAPIルートを使用して、GraphQLミューテーションを呼び出します。

```typescript
// src/app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { gql } from '@apollo/client';
import { getClient } from '@/lib/apollo-client';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    userLogin(input: { email: $email, password: $password }) {
      success
      user {
        id
        username
        email
      }
      errors
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const client = getClient();
    const { data } = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
    });

    if (data?.userLogin?.success) {
      // Cookieはサーバーサイドで設定されるため、ここでは何もしない
      return NextResponse.json({
        success: true,
        user: data.userLogin.user
      });
    } else {
      return NextResponse.json({
        success: false,
        errors: data?.userLogin?.errors || ['ログインに失敗しました']
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      errors: ['サーバーエラーが発生しました']
    }, { status: 500 });
  }
}
```

```typescript
// src/app/api/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { gql } from '@apollo/client';
import { getClient } from '@/lib/apollo-client';

const LOGOUT_MUTATION = gql`
  mutation Logout {
    userLogout {
      success
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const client = getClient();
    const { data } = await client.mutate({
      mutation: LOGOUT_MUTATION,
    });

    if (data?.userLogout?.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({
        success: false,
        errors: ['ログアウトに失敗しました']
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
      success: false,
      errors: ['サーバーエラーが発生しました']
    }, { status: 500 });
  }
}
```

#### 3.2.3 ログインコンポーネント
ログインフォームコンポーネントを実装します。

```typescript
// src/components/auth/Login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { refetchUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Cookieを含める
      });

      const data = await response.json();

      if (data.success) {
        await refetchUser(); // ユーザー情報を再取得
        router.push('/'); // ホームページにリダイレクト
      } else {
        setError(data.errors?.[0] || 'ログインに失敗しました');
      }
    } catch (error) {
      setError('サーバーエラーが発生しました');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>ログイン</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
    </div>
  );
}
```

#### 3.2.4 ナビゲーションコンポーネント
ログイン状態に応じて表示を切り替えるナビゲーションコンポーネントを実装します。

```typescript
// src/components/layout/Navigation.tsx
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';

export default function Navigation() {
  const { isLoggedIn, user, logout, loading } = useAuth();

  return (
    <nav className="main-navigation">
      <div className="logo">
        <Link href="/">
          <img src="/logo.png" alt="福岡遊び" />
        </Link>
      </div>

      <div className="nav-links">
        <Link href="/plans">プラン一覧</Link>
        <Link href="/spots">スポット</Link>
        <Link href="/events">イベント</Link>
      </div>

      <div className="auth-links">
        {loading ? (
          <span>読み込み中...</span>
        ) : isLoggedIn ? (
          <>
            <Link href="/mypage">
              <span className="user-name">{user?.username || 'マイページ'}</span>
            </Link>
            <button onClick={logout} className="logout-button">
              ログアウト
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="login-button">
              ログイン
            </Link>
            <Link href="/register" className="register-button">
              会員登録
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
```

## 4. セキュリティ設計

### 4.1 CSRF対策
- SameSite=Lax 属性を使用して、クロスサイトリクエストでのCookie送信を制限
- GraphQLミューテーションに対してCSRFトークン検証を実装（必要に応じて）

### 4.2 XSS対策
- HttpOnly属性を使用して、JavaScriptからのCookieアクセスを防止
- フロントエンドでのユーザー入力のサニタイズ
- Content-Security-Policy (CSP) の適用

### 4.3 セッションハイジャック対策
- 本番環境ではSecure属性を使用して、HTTPSのみでCookieを送信
- Cookieの暗号化により、セッションIDの漏洩を防止

### 4.4 Cookie署名・暗号化
- Rails の `cookies.encrypted` を使用して、Cookieの内容を暗号化
- 改ざんされたCookieは自動的に拒否される

## 5. 実装計画

### 5.1 バックエンド実装タスク
1. Authentication concernの実装
2. GraphQLコントローラーの拡張
3. ログインミューテーションの拡張
4. ログアウトミューテーションの実装
5. 認証チェックリゾルバーの実装
6. テストの実装

### 5.2 フロントエンド実装タスク
1. 認証コンテキストの実装
2. APIルートの実装
3. ログインコンポーネントの拡張
4. ナビゲーションコンポーネントの実装
5. テストの実装

### 5.3 テスト計画
1. バックエンドユニットテスト
   - Cookie設定のテスト
   - Cookie検証のテスト
   - ログイン/ログアウトフローのテスト
2. フロントエンドユニットテスト
   - 認証コンテキストのテスト
   - ログインコンポーネントのテスト
   - ナビゲーションコンポーネントのテスト
3. 統合テスト
   - エンドツーエンドのログインフローテスト
   - 認証状態に基づくUI表示テスト

## 6. 注意事項と制約

### 6.1 環境依存の設定
- 開発環境ではSecure属性を無効にして、HTTP接続でもテスト可能にする
- 本番環境ではHTTPS必須とする

### 6.2 将来的な拡張性
- JWTとの併用も視野に入れた設計
- リフレッシュトークンの仕組みを追加できるよう拡張性を確保
- 多要素認証への対応も考慮

### 6.3 パフォーマンス考慮事項
- Cookieサイズを最小限に保つ（ユーザーIDのみを保存）
- 不要な認証チェックを減らし、パフォーマンスを最適化
