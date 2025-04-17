'use client';

import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apolloClient';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { ToastProvider } from '@/components/common/ToastContext';

export default function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
