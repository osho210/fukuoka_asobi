#!/bin/bash
set -e

# PIDファイルの削除（前回起動が正常に終了しなかった時の対策）
rm -f /backend/tmp/pids/server.pid

# 任意のコマンド実行（CMDなど）
exec "$@"
