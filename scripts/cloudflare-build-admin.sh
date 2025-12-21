#!/bin/bash
# Cloudflare Pages ビルドスクリプト - Admin
# このスクリプトは Cloudflare Pages のビルド環境で実行されます

set -e  # エラーが発生したら即座に終了

echo "🚀 Cloudflare Pages ビルド開始 - Admin"

# Node.js バージョン確認
echo "📌 Node.js バージョン: $(node --version)"
echo "📌 npm バージョン: $(npm --version)"

# ワークスペース全体の依存関係をインストール
echo "📦 依存関係をインストール中..."
npm install

# admin ディレクトリに移動
echo "📂 admin ディレクトリに移動..."
cd admin

# ビルド実行
echo "🔨 ビルド中..."
npm run build

echo "✅ ビルド完了！"
