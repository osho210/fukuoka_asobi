# ConoHa VPS セットアップガイド

このドキュメントは、ConoHa VPS 上に福岡あそびアプリケーションの本番環境を構築する手順を説明します。

## 目次

1. [前提条件](#前提条件)
2. [VPS の初期設定](#vps-の初期設定)
3. [アプリケーションのセットアップ](#アプリケーションのセットアップ)
4. [GitHub Actions の設定](#github-actions-の設定)
5. [SSL証明書の設定](#ssl証明書の設定)
6. [トラブルシューティング](#トラブルシューティング)

## 前提条件

### VPS スペック

- **OS**: Ubuntu 22.04 LTS
- **メモリ**: 2〜4 GB 以上
- **ストレージ**: 80〜100 GB 以上（SSD推奨）
- **CPU**: 2コア以上

### 必要なもの

- ConoHa VPS アカウント
- ドメイン名（Let's Encrypt 使用のため）
- GitHub アカウント（デプロイ自動化のため）

## VPS の初期設定

### 1. VPS の作成

1. ConoHa コントロールパネルにログイン
2. 「サーバー追加」をクリック
3. 以下の設定でサーバーを作成：
   - **リージョン**: 東京
   - **OS**: Ubuntu 22.04
   - **プラン**: 2GB メモリ以上のプラン
   - **rootパスワード**: 強固なパスワードを設定

### 2. 初回ログイン

```bash
# ローカルマシンから VPS に SSH 接続
ssh root@YOUR_VPS_IP
```

### 3. セキュリティ設定

#### 3.1 システムアップデート

```bash
apt update
apt upgrade -y
```

#### 3.2 deploy ユーザーの作成

```bash
# deploy ユーザーを作成
useradd -m -s /bin/bash deploy
usermod -aG sudo deploy

# sudo 権限を付与
echo "deploy ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/deploy
chmod 440 /etc/sudoers.d/deploy

# パスワードを設定（オプション）
passwd deploy
```

#### 3.3 SSH 公開鍵認証の設定

```bash
# deploy ユーザーに切り替え
su - deploy

# .ssh ディレクトリを作成
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# authorized_keys ファイルを作成（公開鍵をここに追加）
nano ~/.ssh/authorized_keys
# ローカルマシンの公開鍵（~/.ssh/id_ed25519.pub の内容）を貼り付け

chmod 600 ~/.ssh/authorized_keys
exit
```

#### 3.4 SSH 設定の強化（root ログイン無効化）

```bash
# SSH 設定を編集
nano /etc/ssh/sshd_config

# 以下の設定を変更：
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes

# SSH サービスを再起動
systemctl restart sshd
```

**⚠️ 重要**: この設定を適用する前に、deploy ユーザーで SSH ログインできることを確認してください！

### 4. ファイアウォールの設定

```bash
# ufw のインストールと設定
apt install -y ufw

# SSH を許可
ufw allow 22/tcp

# HTTP/HTTPS を許可
ufw allow 80/tcp
ufw allow 443/tcp

# ファイアウォールを有効化
ufw enable

# 状態確認
ufw status
```

## アプリケーションのセットアップ

### 1. 自動セットアップスクリプトの実行

```bash
# deploy ユーザーでログイン
ssh deploy@YOUR_VPS_IP

# 一時ディレクトリにリポジトリをクローン
cd /tmp
git clone https://github.com/osho210/fukuoka_asobi.git

# セットアップスクリプトを実行
sudo bash /tmp/fukuoka_asobi/backend/bin/setup_vps
```

このスクリプトは以下を実行します：

- 基本パッケージのインストール（Git, Nginx, MySQL など）
- rbenv と Ruby 3.3.1 のインストール
- MySQL データベースとユーザーの作成
- アプリケーションディレクトリの作成

### 2. MySQL パスワードの変更

セキュリティのため、MySQL パスワードを変更します：

```bash
sudo mysql -e "ALTER USER 'fukuoka_asobi'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';"
```

### 3. アプリケーションコードのデプロイ

```bash
# アプリケーションディレクトリを作成
sudo mkdir -p /var/www/fukuoka_asobi/{current,shared/{tmp/{pids,sockets},log,storage}}
sudo chown -R deploy:deploy /var/www/fukuoka_asobi

# リポジトリをクローン
git clone https://github.com/osho210/fukuoka_asobi.git /var/www/fukuoka_asobi/current
cd /var/www/fukuoka_asobi/current/backend

# Bundler のインストール
gem install bundler

# 依存関係のインストール
bundle install --deployment --without development test
```

### 4. 環境変数の設定

```bash
# 環境変数ファイルを作成
cp /var/www/fukuoka_asobi/current/backend/config/.env.production.example \
   /var/www/fukuoka_asobi/shared/.env.production

# 環境変数を編集
nano /var/www/fukuoka_asobi/shared/.env.production
```

以下の値を設定します：

```bash
# Rails 設定
RAILS_MASTER_KEY=your_master_key_here  # config/master.key の内容

# データベース設定
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=fukuoka_asobi
DB_PASSWORD=YOUR_STRONG_PASSWORD
DB_NAME=fukuoka_asobi_production

# アプリケーション設定
APP_HOST=your-domain.example.com
FRONTEND_URL=https://your-frontend-domain.example.com
ADMIN_URL=https://your-admin-domain.example.com

# その他必要な環境変数...
```

### 5. データベースのセットアップ

```bash
cd /var/www/fukuoka_asobi/current/backend

# 環境変数を読み込む
export $(cat /var/www/fukuoka_asobi/shared/.env.production | grep -v '^#' | xargs)

# データベースマイグレーション
RAILS_ENV=production bundle exec rails db:migrate

# シードデータの投入（オプション）
RAILS_ENV=production bundle exec rails db:seed
```

### 6. アセットのプリコンパイル

```bash
cd /var/www/fukuoka_asobi/current/backend
RAILS_ENV=production bundle exec rails assets:precompile
```

### 7. Nginx の設定

```bash
# Nginx 設定ファイルをコピー
sudo cp /var/www/fukuoka_asobi/current/backend/config/nginx/fukuoka_asobi.conf \
        /etc/nginx/sites-available/fukuoka_asobi

# ドメイン名を編集
sudo nano /etc/nginx/sites-available/fukuoka_asobi
# server_name を実際のドメインに変更

# シンボリックリンクを作成
sudo ln -s /etc/nginx/sites-available/fukuoka_asobi /etc/nginx/sites-enabled/

# デフォルト設定を無効化
sudo rm /etc/nginx/sites-enabled/default

# 設定をテスト
sudo nginx -t

# Nginx を再起動
sudo systemctl reload nginx
```

### 8. systemd サービスの設定

```bash
# systemd サービスファイルをコピー
sudo cp /var/www/fukuoka_asobi/current/backend/config/systemd/fukuoka_asobi.service \
        /etc/systemd/system/

# サービスファイルを編集（必要に応じて）
sudo nano /etc/systemd/system/fukuoka_asobi.service

# systemd をリロード
sudo systemctl daemon-reload

# サービスを有効化
sudo systemctl enable fukuoka_asobi

# サービスを起動
sudo systemctl start fukuoka_asobi

# 状態確認
sudo systemctl status fukuoka_asobi
```

### 9. 動作確認

```bash
# ローカルでヘルスチェック
curl http://localhost:3000/up

# 外部からアクセス確認
curl http://YOUR_VPS_IP/up
```

## GitHub Actions の設定

自動デプロイを設定するため、GitHub リポジトリに以下の Secrets を追加します。

### 1. SSH キーペアの生成

ローカルマシンで実行：

```bash
# GitHub Actions 用の SSH キーペアを生成
ssh-keygen -t ed25519 -C "github-actions@fukuoka_asobi" -f ~/.ssh/github_actions_fukuoka_asobi
```

### 2. VPS に公開鍵を登録

```bash
# 公開鍵を VPS に登録
ssh-copy-id -i ~/.ssh/github_actions_fukuoka_asobi.pub deploy@YOUR_VPS_IP

# または手動で追加
ssh deploy@YOUR_VPS_IP
echo "公開鍵の内容" >> ~/.ssh/authorized_keys
```

### 3. GitHub Secrets の設定

GitHub リポジトリの Settings > Secrets and variables > Actions で以下を追加：

| Secret 名 | 値 |
|-----------|-----|
| `VPS_HOST` | VPS の IP アドレスまたはドメイン |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | `~/.ssh/github_actions_fukuoka_asobi` の内容（秘密鍵） |

### 4. デプロイテスト

```bash
# main ブランチに push してデプロイをテスト
git push origin main

# GitHub Actions のログで進捗を確認
# https://github.com/osho210/fukuoka_asobi/actions
```

## SSL証明書の設定

### Let's Encrypt で SSL 証明書を取得

```bash
# certbot で証明書を取得
sudo certbot --nginx -d your-domain.example.com

# 自動更新の確認
sudo certbot renew --dry-run
```

### Nginx 設定の有効化

```bash
# Nginx 設定ファイルで HTTPS セクションのコメントを解除
sudo nano /etc/nginx/sites-available/fukuoka_asobi

# Nginx を再起動
sudo systemctl reload nginx
```

## トラブルシューティング

### サービスが起動しない

```bash
# ログを確認
sudo journalctl -u fukuoka_asobi -n 100 --no-pager

# Puma のログを確認
tail -f /var/www/fukuoka_asobi/shared/log/puma_stderr.log
```

### データベース接続エラー

```bash
# MySQL の状態確認
sudo systemctl status mysql

# データベース接続テスト
mysql -u fukuoka_asobi -p -h localhost fukuoka_asobi_production
```

### Nginx エラー

```bash
# Nginx のログを確認
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/www/fukuoka_asobi/shared/log/nginx_error.log

# 設定ファイルの文法チェック
sudo nginx -t
```

### ディスク容量の確認

```bash
# ディスク使用状況
df -h

# 大きなファイル/ディレクトリを検索
du -sh /var/www/fukuoka_asobi/* | sort -h
```

### パフォーマンスモニタリング

```bash
# メモリ使用状況
free -h

# CPU 使用状況
top

# プロセス確認
ps aux | grep puma
```

## 定期メンテナンス

### ログのローテーション

```bash
# logrotate の設定
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

### バックアップ

```bash
# データベースバックアップ
mysqldump -u fukuoka_asobi -p fukuoka_asobi_production > backup_$(date +%Y%m%d).sql

# 画像ファイルのバックアップ
tar -czf storage_backup_$(date +%Y%m%d).tar.gz /var/www/fukuoka_asobi/shared/storage/
```

## まとめ

これで ConoHa VPS 上に本番環境が構築され、GitHub Actions による自動デプロイが設定されました。

次のステップ：
- 監視ツールの導入（Uptime Robot, Datadog など）
- 定期バックアップの自動化
- パフォーマンスチューニング
- S3 への移行検討（画像が増えた場合）
