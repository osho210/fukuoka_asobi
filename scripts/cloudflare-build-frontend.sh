#!/bin/bash
# Cloudflare Pages ビルドスクリプト - Frontend
# このスクリプトは Cloudflare Pages のビルド環境で実行されます

set -e  # エラーが発生したら即座に終了

echo "🚀 Cloudflare Pages ビルド開始 - Frontend"

# Node.js バージョン確認
echo "📌 Node.js バージョン: $(node --version)"
echo "📌 npm バージョン: $(npm --version)"

# ワークスペース全体の依存関係をインストール
echo "📦 依存関係をインストール中..."
npm install

# frontend ディレクトリに移動
echo "📂 frontend ディレクトリに移動..."
cd frontend

# ビルド実行
echo "🔨 ビルド中..."
npm run build

echo "✅ ビルド完了！"
