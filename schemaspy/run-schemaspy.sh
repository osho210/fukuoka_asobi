#!/bin/bash

# SchemaSpy実行スクリプト

echo "SchemaSpy を実行します..."

# 既存のコンテナを停止・削除（もし存在すれば）
docker-compose stop schemaspy
docker-compose rm -f schemaspy

# SchemaSpy コンテナを実行
docker-compose up schemaspy

echo "SchemaSpy の実行が完了しました。"
echo "結果は ./schemaspy/output ディレクトリに保存されています。"
echo "index.html をブラウザで開いて確認してください。"
