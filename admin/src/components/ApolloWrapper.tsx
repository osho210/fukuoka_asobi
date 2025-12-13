'use client';

import { ApolloProvider } from '@apollo/client';
import { ReactNode } from 'react';
import { apolloClient } from '@/lib/apolloClient';

/**
 * Apollo Provider ラッパー
 * 全体で統一された Apollo Client インスタンスを使用
 * Cookie ベースの認証により、すべてのリクエストで自動的に認証情報が送信される
 */
export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
