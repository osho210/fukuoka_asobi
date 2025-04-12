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
    domains: ["example.com"], // 外部画像のホスト名を追加
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8200',
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
