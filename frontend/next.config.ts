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
    ],
  },
  // APIリクエストをバックエンドに転送するためのプロキシ設定
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:3000/api/v1/:path*',
      },
      {
        source: '/graphql',
        destination: 'http://localhost:3000/graphql',
      },
      {
        source: '/letter_opener/:path*',
        destination: 'http://localhost:3000/letter_opener',
      },
    ];
  },
};

export default nextConfig;
