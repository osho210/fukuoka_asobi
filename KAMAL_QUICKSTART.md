# Kamal デプロイ クイックスタート

ConoHa VPS に Kamal を使用してデプロイする最小限の手順です。

## 🚀 5分でデプロイ

### 1. 環境変数を設定

```bash
# ~/.bashrc または ~/.zshrc に追加
export KAMAL_REGISTRY_PASSWORD="your_github_token"  # GitHub Container Registry の場合
export MYSQL_ROOT_PASSWORD="your_secure_password"
export DB_PASSWORD="your_secure_password"
export MINIO_ROOT_PASSWORD="your_secure_password"
export SECRET_KEY_BASE=$(cd backend && bundle exec rails secret)

source ~/.bashrc  # 設定を反映
```

### 2. 設定ファイルを編集

```bash
cd backend
nano config/deploy.yml
```

以下を編集：
- `servers.web` の IP アドレス
- `proxy.host` のドメイン名
- `registry.username` と `image` の設定
- `accessories.db.host` と `accessories.minio.host` の IP アドレス

### 3. デプロイ実行

```bash
# 初回セットアップ
bin/kamal setup

# データベースのマイグレーション
bin/kamal app exec "bin/rails db:setup"

# デプロイ
bin/kamal deploy
```

### 4. 確認

```bash
# ヘルスチェック
curl https://your-domain.com/up

# ログ確認
bin/kamal app logs -f
```

## 🔄 更新時

```bash
cd backend
git pull origin main
bin/kamal deploy
```

以上！

詳細は [KAMAL_DEPLOYMENT_GUIDE.md](./KAMAL_DEPLOYMENT_GUIDE.md) を参照してください。
