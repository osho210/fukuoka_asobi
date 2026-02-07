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

# データベースのマイグレーション（初回のみ）
bin/kamal app exec "bin/rails db:setup"

# デプロイ（マイグレーションは自動実行）
bin/kamal deploy
```

### 4. 確認

```bash
# ヘルスチェック
curl https://your-domain.com/up

# ログ確認
bin/kamal app logs -f

# マイグレーション状態確認
bin/kamal app exec "bin/rails db:version"
```

## 🔄 更新時

```bash
cd backend
git pull origin main
# デプロイ時にマイグレーションが自動実行されます
bin/kamal deploy
```

## ✨ 自動マイグレーション機能

✅ **マイグレーション自動化済み** - 新しいマイグレーションファイルをコミットしてプッシュすると、デプロイ時に自動的に実行されます。

```bash
# マイグレーションファイル作成・コミット
cd backend
bin/rails generate migration AddWeatherToBucketListItems
git add db/migrate/
git commit -m "feat: add weather column to bucket_list_items"
git push origin feature-branch

# PR マージ後、デプロイワークフローが自動実行
# → Kamal デプロイ → マイグレーション自動実行
```

## 📋 デプロイフロー（GitHub Actions 自動化）

1. **コード変更 + マイグレーション作成**
2. **GitHub にプッシュ** → CI/CD 検証実行
3. **PR をマージ** → main ブランチへ
4. **GitHub Actions デプロイワークフーク起動**
   - Kamal デプロイ実行
   - DB マイグレーション自動実行
   - ヘルスチェック実行

詳細は [KAMAL_DEPLOYMENT_GUIDE.md](./KAMAL_DEPLOYMENT_GUIDE.md) を参照してください。
