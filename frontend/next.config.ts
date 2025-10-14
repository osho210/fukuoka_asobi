import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@styles": path.resolve(__dirname, "./public/styles"),
    };
    return config;
  },
  typescript: {
    // TODO:最速でデプロイするために一時的に無効化。本来は有効にする
    ignoreBuildErrors: true
  },
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
};

export default nextConfig;
