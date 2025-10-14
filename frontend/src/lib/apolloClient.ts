import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        // 開発環境ではNext.jsのリライト機能を使用するため相対パス
        // 本番環境では環境変数から取得
        uri: process.env.NODE_ENV === 'production'
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`
            : '/graphql',
        credentials: 'include',
    }),
    cache: new InMemoryCache(),
});

export default client;
