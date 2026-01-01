import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"], // 外部画像のホスト名を追加
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/rails/active_storage/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8200',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'minio',
        port: '9000',
        pathname: '/**',
      },
      // 本番環境用
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.fly.dev',
        pathname: '/rails/active_storage/**',
      },
    ],
  },
  // APIリクエストをバックエンドに転送するためのプロキシ設定
  async rewrites() {
    // 本番環境ではrewritesを使わず、環境変数で直接指定
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

    // 開発環境のみrewritesを使用
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/v1/:path*',
          destination: `${backendUrl}/api/v1/:path*`,
        },
        {
          source: '/graphql',
          destination: `${backendUrl}/graphql`,
        },
        {
          source: '/letter_opener/:path*',
          destination: `${backendUrl}/letter_opener`,
        },
      ];
    }
    return [];
  },
  // BFCache対策のためのHTTPキャッシュヘッダー設定
  async headers() {
    return [
      {
        // 全てのページに対してキャッシュ制御ヘッダーを設定
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      {
        // APIエンドポイントにはキャッシュを無効化
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, max-age=0, no-cache',
          },
        ],
      },
      {
        // GraphQLエンドポイントにもキャッシュを無効化
        source: '/graphql',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, max-age=0, no-cache',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
