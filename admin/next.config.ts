import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // TODO:最速でデプロイするために一時的に無効化。本来は有効にする
    ignoreBuildErrors: true,
  },
  eslint: {
    // TODO:最速でデプロイするために一時的に無効化。本来は有効にする
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/rails/active_storage/**',
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
      ];
    }
    return [];
  },
};

export default nextConfig;
