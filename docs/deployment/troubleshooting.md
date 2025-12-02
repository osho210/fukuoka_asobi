# トラブルシューティングガイド

本番環境でよく発生する問題と解決方法をまとめたガイドです。

## 目次

1. [サービス起動の問題](#サービス起動の問題)
2. [データベース接続の問題](#データベース接続の問題)
3. [Nginx の問題](#nginx-の問題)
4. [パフォーマンスの問題](#パフォーマンスの問題)
5. [画像アップロードの問題](#画像アップロードの問題)
6. [GitHub Actions の問題](#github-actions-の問題)
7. [SSL 証明書の問題](#ssl-証明書の問題)

## サービス起動の問題

### 症状: Puma が起動しない

#### 診断

```bash
# サービス状態確認
sudo systemctl status fukuoka_asobi

# ログ確認
sudo journalctl -u fukuoka_asobi -n 100 --no-pager

# Puma のエラーログ確認
tail -f /var/www/fukuoka_asobi/shared/log/puma_stderr.log
```

#### 原因と解決策

**1. 環境変数が設定されていない**

```bash
# .env.production の存在確認
ls -la /var/www/fukuoka_asobi/shared/.env.production

# 環境変数の内容確認
cat /var/www/fukuoka_asobi/shared/.env.production

# 必要な環境変数が設定されているか確認
grep RAILS_MASTER_KEY /var/www/fukuoka_asobi/shared/.env.production
```

**2. ソケットファイルのディレクトリが存在しない**

```bash
# ディレクトリを作成
mkdir -p /var/www/fukuoka_asobi/shared/tmp/{pids,sockets}
chown -R deploy:deploy /var/www/fukuoka_asobi/shared/tmp
```

**3. ポートが既に使用されている**

```bash
# ポート使用状況確認
sudo lsof -i :3000

# プロセスを終了
sudo kill -9 PID
```

**4. 依存関係が不足している**

```bash
cd /var/www/fukuoka_asobi/current/backend
bundle install --deployment --without development test
```

### 症状: サービスが頻繁に再起動する

#### 診断

```bash
# サービスのリスタート回数確認
systemctl show fukuoka_asobi -p NRestarts

# メモリ使用状況確認
free -h

# ログからエラー確認
sudo journalctl -u fukuoka_asobi --since "1 hour ago" | grep -i error
```

#### 原因と解決策

**1. メモリ不足**

```bash
# Puma ワーカー数を減らす
nano /var/www/fukuoka_asobi/shared/.env.production
# WEB_CONCURRENCY=1 に変更

# サービス再起動
sudo systemctl restart fukuoka_asobi
```

**2. データベース接続タイムアウト**

```bash
# database.yml の pool 設定を調整
nano /var/www/fukuoka_asobi/current/backend/config/database.yml
# pool: 5 → pool: 3 に減らす
```

## データベース接続の問題

### 症状: Can't connect to MySQL server

#### 診断

```bash
# MySQL サービス状態確認
sudo systemctl status mysql

# MySQL 接続テスト
mysql -u fukuoka_asobi -p -h localhost fukuoka_asobi_production
```

#### 原因と解決策

**1. MySQL サービスが起動していない**

```bash
# MySQL を起動
sudo systemctl start mysql

# 自動起動を有効化
sudo systemctl enable mysql
```

**2. 認証情報が間違っている**

```bash
# ユーザーとパスワードを確認
sudo mysql -e "SELECT user, host FROM mysql.user WHERE user='fukuoka_asobi';"

# パスワードをリセット
sudo mysql -e "ALTER USER 'fukuoka_asobi'@'localhost' IDENTIFIED BY 'new_password';"

# .env.production のパスワードも更新
nano /var/www/fukuoka_asobi/shared/.env.production
```

**3. データベースが存在しない**

```bash
# データベース一覧確認
sudo mysql -e "SHOW DATABASES;"

# データベースを作成
sudo mysql -e "CREATE DATABASE fukuoka_asobi_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 症状: Too many connections

#### 診断

```bash
# 現在の接続数確認
sudo mysql -e "SHOW STATUS LIKE 'Threads_connected';"

# 最大接続数確認
sudo mysql -e "SHOW VARIABLES LIKE 'max_connections';"
```

#### 解決策

```bash
# MySQL の最大接続数を増やす
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# [mysqld] セクションに追加:
# max_connections = 200

# MySQL を再起動
sudo systemctl restart mysql
```

## Nginx の問題

### 症状: 502 Bad Gateway

#### 診断

```bash
# Nginx のエラーログ確認
sudo tail -f /var/log/nginx/error.log

# Puma が起動しているか確認
sudo systemctl status fukuoka_asobi

# ソケットファイルの存在確認
ls -la /var/www/fukuoka_asobi/shared/tmp/sockets/puma.sock
```

#### 原因と解決策

**1. Puma が起動していない**

```bash
# Puma を起動
sudo systemctl start fukuoka_asobi

# ログで起動状態確認
sudo journalctl -u fukuoka_asobi -n 50
```

**2. ソケットファイルのパスが間違っている**

```bash
# Nginx 設定確認
sudo nano /etc/nginx/sites-available/fukuoka_asobi
# upstream puma のソケットパスを確認

# Puma 設定確認
cat /var/www/fukuoka_asobi/current/backend/config/puma.rb | grep bind
```

**3. 権限の問題**

```bash
# ソケットファイルの権限確認
ls -la /var/www/fukuoka_asobi/shared/tmp/sockets/

# 権限を修正
sudo chown -R deploy:deploy /var/www/fukuoka_asobi/shared/tmp
```

### 症状: 413 Request Entity Too Large

#### 解決策

```bash
# Nginx 設定でアップロードサイズ上限を増やす
sudo nano /etc/nginx/sites-available/fukuoka_asobi
# client_max_body_size 10M; → client_max_body_size 20M;

# Nginx を再起動
sudo systemctl reload nginx
```

## パフォーマンスの問題

### 症状: レスポンスが遅い

#### 診断

```bash
# CPU 使用率確認
top

# メモリ使用率確認
free -h

# ディスク I/O 確認
iostat -x 1 5

# データベース接続数確認
sudo mysql -e "SHOW STATUS LIKE 'Threads_connected';"
```

#### 原因と解決策

**1. メモリ不足**

```bash
# メモリ使用状況の詳細確認
ps aux --sort=-%mem | head -10

# Puma ワーカー数を減らす
nano /var/www/fukuoka_asobi/shared/.env.production
# WEB_CONCURRENCY を減らす

# 不要なプロセスを停止
# (例: 不要なサービスの停止)
```

**2. データベースクエリが遅い**

```bash
# スロークエリログを有効化
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# 以下を追加:
# slow_query_log = 1
# long_query_time = 2
# slow_query_log_file = /var/log/mysql/slow.log

# MySQL を再起動
sudo systemctl restart mysql

# スロークエリログを確認
sudo tail -f /var/log/mysql/slow.log
```

**3. アセットの最適化不足**

```bash
# アセットを再コンパイル
cd /var/www/fukuoka_asobi/current/backend
RAILS_ENV=production bundle exec rails assets:precompile

# Nginx で gzip 圧縮を有効化
sudo nano /etc/nginx/nginx.conf
# gzip_static on; のコメントを解除
```

### 症状: ディスク容量不足

#### 診断

```bash
# ディスク使用状況確認
df -h

# 大きなファイル/ディレクトリを検索
du -sh /var/www/fukuoka_asobi/* | sort -h
du -sh /var/log/* | sort -h
```

#### 解決策

```bash
# 古いログファイルを削除
sudo find /var/log -name "*.log" -mtime +30 -delete
find /var/www/fukuoka_asobi/shared/log -name "*.log" -mtime +30 -delete

# ログローテーションを設定
sudo nano /etc/logrotate.d/fukuoka_asobi
```

```
/var/www/fukuoka_asobi/shared/log/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    copytruncate
}
```

```bash
# 不要な gem を削除
cd /var/www/fukuoka_asobi/current/backend
bundle clean --force
```

## 画像アップロードの問題

### 症状: 画像がアップロードできない

#### 診断

```bash
# storage ディレクトリの権限確認
ls -la /var/www/fukuoka_asobi/shared/storage/

# ディスク容量確認
df -h

# Rails ログ確認
tail -f /var/www/fukuoka_asobi/shared/log/production.log
```

#### 原因と解決策

**1. 権限の問題**

```bash
# storage ディレクトリの権限を修正
sudo chown -R deploy:deploy /var/www/fukuoka_asobi/shared/storage
chmod -R 755 /var/www/fukuoka_asobi/shared/storage
```

**2. ActiveStorage の設定ミス**

```bash
# production.rb の設定確認
grep active_storage /var/www/fukuoka_asobi/current/backend/config/environments/production.rb

# storage.yml の設定確認
cat /var/www/fukuoka_asobi/current/backend/config/storage.yml

# 環境変数確認
grep ACTIVE_STORAGE_SERVICE /var/www/fukuoka_asobi/shared/.env.production
```

### 症状: 画像が表示されない

#### 診断

```bash
# Nginx のアクセスログ確認
sudo tail -f /var/log/nginx/access.log | grep rails/active_storage

# 画像ファイルの存在確認
ls -la /var/www/fukuoka_asobi/shared/storage/
```

#### 解決策

```bash
# Nginx 設定で ActiveStorage のパスを確認
sudo nano /etc/nginx/sites-available/fukuoka_asobi
# location ~ ^/rails/active_storage/ のセクションを確認

# Nginx を再起動
sudo systemctl reload nginx
```

## GitHub Actions の問題

### 症状: デプロイワークフローが失敗する

#### 診断

1. GitHub の Actions タブを開く
2. 失敗したワークフローを選択
3. 各ステップのログを確認

#### 原因と解決策

**1. SSH 接続エラー**

```bash
# Secrets の確認
# GitHub リポジトリ Settings > Secrets and variables > Actions
# VPS_HOST, VPS_USER, VPS_SSH_KEY が正しく設定されているか確認

# VPS 側で authorized_keys を確認
ssh deploy@YOUR_VPS_IP
cat ~/.ssh/authorized_keys
```

**2. 権限エラー**

```bash
# deploy ユーザーに sudo 権限があるか確認
ssh deploy@YOUR_VPS_IP
sudo -l

# アプリケーションディレクトリの所有者確認
ls -la /var/www/fukuoka_asobi/
```

**3. ディスク容量不足**

```bash
ssh deploy@YOUR_VPS_IP
df -h
```

## SSL 証明書の問題

### 症状: Let's Encrypt の証明書取得に失敗

#### 診断

```bash
# certbot のログ確認
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

#### 原因と解決策

**1. DNS 設定が正しくない**

```bash
# ドメインの DNS レコード確認
nslookup your-domain.example.com

# dig コマンドで確認
dig your-domain.example.com
```

**2. ファイアウォールで HTTP/HTTPS がブロックされている**

```bash
# ファイアウォール設定確認
sudo ufw status

# HTTP/HTTPS を許可
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

**3. Nginx が既に 80 番ポートをリスンしている**

```bash
# certbot で standalone モードではなく nginx プラグインを使用
sudo certbot --nginx -d your-domain.example.com
```

### 症状: 証明書の自動更新が失敗する

#### 診断

```bash
# 証明書の有効期限確認
sudo certbot certificates

# テスト更新
sudo certbot renew --dry-run
```

#### 解決策

```bash
# cron または systemd timer を確認
systemctl list-timers | grep certbot

# 手動で更新
sudo certbot renew
```

## 緊急対応

### サイトが完全にダウンしている場合

1. **ヘルスチェック**
   ```bash
   curl http://YOUR_VPS_IP/up
   ```

2. **サービス状態確認**
   ```bash
   sudo systemctl status fukuoka_asobi
   sudo systemctl status nginx
   sudo systemctl status mysql
   ```

3. **ログ確認**
   ```bash
   # 最新のエラーを確認
   sudo journalctl -u fukuoka_asobi -n 100 --no-pager | grep -i error
   sudo tail -f /var/log/nginx/error.log
   ```

4. **再起動**
   ```bash
   sudo systemctl restart fukuoka_asobi
   sudo systemctl restart nginx
   ```

5. **それでも解決しない場合**
   - 最新の安定版にロールバック
   - データベースのバックアップから復元
   - サポートに連絡

## 監視とアラート

### 推奨する監視項目

- **稼働監視**: Uptime Robot（無料プラン）
- **リソース監視**: Datadog, New Relic（有料）
- **エラー追跡**: Sentry（有料/無料プラン）
- **ログ管理**: Papertrail, Loggly（有料）

### 基本的な監視スクリプト

```bash
#!/bin/bash
# /usr/local/bin/health_check.sh

# ヘルスチェック
if ! curl -sf http://localhost:3000/up > /dev/null; then
    echo "Application is down!" | mail -s "Alert: App Down" admin@example.com
    sudo systemctl restart fukuoka_asobi
fi

# ディスク容量チェック
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Disk usage is ${DISK_USAGE}%" | mail -s "Alert: Disk Space" admin@example.com
fi
```

```bash
# cron に追加（5分おきに実行）
sudo crontab -e
# */5 * * * * /usr/local/bin/health_check.sh
```

## 参考資料

- [Rails ガイド - デバッグ](https://guides.rubyonrails.org/debugging_rails_applications.html)
- [Puma デバッグガイド](https://github.com/puma/puma/blob/master/docs/deployment.md)
- [Nginx トラブルシューティング](https://www.nginx.com/resources/wiki/start/topics/tutorials/debugging/)
- [MySQL トラブルシューティング](https://dev.mysql.com/doc/refman/8.0/en/problems.html)
