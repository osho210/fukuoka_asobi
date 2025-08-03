import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
