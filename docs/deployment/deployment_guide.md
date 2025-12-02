# デプロイ手順書

このドキュメントは、本番環境へのデプロイ手順を説明します。

## デプロイ方法

本番環境へのデプロイは以下の2つの方法があります：

1. **自動デプロイ（推奨）**: GitHub Actions を使用した CI/CD パイプライン
2. **手動デプロイ**: SSH 経由で手動実行

## 自動デプロイ（GitHub Actions）

### 前提条件

- [ConoHa VPS セットアップガイド](./conoha_vps_setup.md) の完了
- GitHub Secrets の設定完了
  - `VPS_HOST`: VPS の IP アドレス
  - `VPS_USER`: デプロイユーザー（通常は `deploy`）
  - `VPS_SSH_KEY`: SSH 秘密鍵

### デプロイ手順

1. **コードの変更をコミット**

```bash
git add .
git commit -m "feat: 新機能の追加"
```

2. **main ブランチにプッシュ**

```bash
git push origin main
```

3. **GitHub Actions の実行確認**

- GitHub リポジトリの「Actions」タブを開く
- 「Deploy to ConoHa VPS」ワークフローの実行状態を確認
- ログで各ステップの進捗を確認

4. **デプロイ完了確認**

```bash
# ヘルスチェック
curl https://your-domain.example.com/up

# または
curl http://YOUR_VPS_IP/up
```

### デプロイフロー

```
コード変更
   ↓
main ブランチへ push
   ↓
GitHub Actions トリガー
   ↓
VPS に SSH 接続
   ↓
git pull
   ↓
bundle install
   ↓
assets:precompile
   ↓
db:migrate
   ↓
systemctl restart
   ↓
ヘルスチェック
   ↓
完了
```

## 手動デプロイ

緊急時や GitHub Actions が使用できない場合の手動デプロイ手順です。

### 1. VPS にログイン

```bash
ssh deploy@YOUR_VPS_IP
```

### 2. アプリケーションディレクトリに移動

```bash
cd /var/www/fukuoka_asobi/current
```

### 3. リポジトリを更新

```bash
git fetch origin
git reset --hard origin/main
git clean -fd
```

### 4. backend ディレクトリに移動

```bash
cd backend
```

### 5. 環境変数を読み込む

```bash
export $(cat /var/www/fukuoka_asobi/shared/.env.production | grep -v '^#' | xargs)
```

### 6. 依存関係をインストール

```bash
bundle install --deployment --without development test
```

### 7. シンボリックリンクを作成

```bash
ln -nfs /var/www/fukuoka_asobi/shared/storage storage
ln -nfs /var/www/fukuoka_asobi/shared/log log
ln -nfs /var/www/fukuoka_asobi/shared/tmp tmp
```

### 8. アセットをプリコンパイル

```bash
RAILS_ENV=production bundle exec rails assets:precompile
```

### 9. データベースマイグレーション

```bash
RAILS_ENV=production bundle exec rails db:migrate
```

### 10. Puma を再起動

```bash
sudo systemctl restart fukuoka_asobi
```

### 11. デプロイ確認

```bash
# サービス状態確認
sudo systemctl status fukuoka_asobi

# ヘルスチェック
curl http://localhost:3000/up

# ログ確認
sudo journalctl -u fukuoka_asobi -n 50 --no-pager
```

## ロールバック

デプロイ後に問題が発生した場合のロールバック手順です。

### 1. VPS にログイン

```bash
ssh deploy@YOUR_VPS_IP
```

### 2. 以前のコミットに戻す

```bash
cd /var/www/fukuoka_asobi/current

# コミット履歴を確認
git log --oneline -10

# 特定のコミットに戻す
git reset --hard COMMIT_HASH
```

### 3. 依存関係の再インストール（必要な場合）

```bash
cd backend
bundle install --deployment --without development test
```

### 4. マイグレーションのロールバック（必要な場合）

```bash
# 環境変数を読み込む
export $(cat /var/www/fukuoka_asobi/shared/.env.production | grep -v '^#' | xargs)

# 最後のマイグレーションをロールバック
RAILS_ENV=production bundle exec rails db:rollback

# 複数のマイグレーションをロールバック
RAILS_ENV=production bundle exec rails db:rollback STEP=3
```

### 5. サービスを再起動

```bash
sudo systemctl restart fukuoka_asobi
```

### 6. 動作確認

```bash
curl http://localhost:3000/up
sudo journalctl -u fukuoka_asobi -n 50 --no-pager
```

## デプロイチェックリスト

デプロイ前に確認すべき項目：

### コードレビュー

- [ ] プルリクエストがレビューされている
- [ ] CI テストが全て成功している
- [ ] セキュリティスキャン（Brakeman）が成功している
- [ ] Lint チェック（RuboCop）が成功している

### データベース

- [ ] マイグレーションファイルがある場合、ローカルで動作確認済み
- [ ] ロールバック可能なマイグレーションである
- [ ] データ損失のリスクがないか確認済み

### 環境変数

- [ ] 新しい環境変数が必要な場合、`.env.production` に追加済み
- [ ] 機密情報が Git にコミットされていないか確認済み

### アセット

- [ ] 画像やスタイルシートの変更がある場合、プリコンパイル済み
- [ ] ローカルで assets:precompile が成功することを確認

### 依存関係

- [ ] Gemfile の変更がある場合、bundle install が成功することを確認
- [ ] 新しい Gem のライセンスを確認済み

### ドキュメント

- [ ] CHANGELOG.md が更新されている
- [ ] README.md が最新の状態である
- [ ] API の変更がある場合、ドキュメントが更新されている

## デプロイ後の確認

デプロイ完了後に確認すべき項目：

### 動作確認

- [ ] ヘルスチェックが成功している（`/up` エンドポイント）
- [ ] トップページが正常に表示される
- [ ] ログインが正常に動作する
- [ ] 主要な機能が正常に動作する
- [ ] 画像アップロードが正常に動作する

### ログ確認

- [ ] エラーログに新しいエラーがないか確認
- [ ] アクセスログが正常に記録されているか確認

```bash
# Puma のログ
tail -f /var/www/fukuoka_asobi/shared/log/puma_stderr.log

# Nginx のログ
sudo tail -f /var/log/nginx/error.log

# systemd のログ
sudo journalctl -u fukuoka_asobi -f
```

### パフォーマンス確認

- [ ] レスポンス時間が正常範囲内である
- [ ] CPU 使用率が正常範囲内である
- [ ] メモリ使用率が正常範囲内である

```bash
# リソース使用状況
top
free -h
df -h
```

### データベース確認

- [ ] マイグレーションが正常に完了している
- [ ] データの整合性が保たれている

```bash
# マイグレーション状態確認
RAILS_ENV=production bundle exec rails db:migrate:status
```

## トラブルシューティング

### デプロイが失敗する

#### GitHub Actions でデプロイ失敗

1. **GitHub Actions のログを確認**
   - Actions タブで失敗したワークフローを開く
   - エラーメッセージを確認

2. **SSH 接続エラーの場合**
   ```bash
   # SSH キーの権限確認
   ls -la ~/.ssh/
   
   # VPS への接続確認
   ssh deploy@YOUR_VPS_IP
   ```

3. **Secrets の確認**
   - `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` が正しく設定されているか確認

#### サービス起動失敗

```bash
# サービス状態確認
sudo systemctl status fukuoka_asobi

# ログ確認
sudo journalctl -u fukuoka_asobi -n 100 --no-pager

# 設定ファイル確認
cat /etc/systemd/system/fukuoka_asobi.service
```

#### アセットが表示されない

```bash
# アセットの再コンパイル
cd /var/www/fukuoka_asobi/current/backend
RAILS_ENV=production bundle exec rails assets:precompile

# Nginx 設定確認
sudo nginx -t
sudo systemctl reload nginx
```

#### データベース接続エラー

```bash
# 環境変数確認
cat /var/www/fukuoka_asobi/shared/.env.production

# MySQL 接続確認
mysql -u fukuoka_asobi -p -h localhost fukuoka_asobi_production

# MySQL サービス確認
sudo systemctl status mysql
```

### パフォーマンス問題

#### メモリ不足

```bash
# メモリ使用状況確認
free -h

# Puma ワーカー数を減らす
nano /var/www/fukuoka_asobi/shared/.env.production
# WEB_CONCURRENCY=1 に変更

# サービス再起動
sudo systemctl restart fukuoka_asobi
```

#### ディスク容量不足

```bash
# ディスク使用状況確認
df -h

# 古いログの削除
find /var/www/fukuoka_asobi/shared/log -name "*.log" -mtime +30 -delete

# 古いリリースの削除
ls -t /var/www/fukuoka_asobi/releases/ | tail -n +6 | xargs -r rm -rf
```

## 定期メンテナンス

### 毎日

- [ ] エラーログの確認
- [ ] ディスク使用量の確認

### 毎週

- [ ] パフォーマンスモニタリング
- [ ] セキュリティアップデートの確認

### 毎月

- [ ] データベースバックアップ
- [ ] ログのアーカイブ
- [ ] 不要なファイルの削除

## 連絡先

問題が発生した場合の連絡先：

- **開発チーム**: [連絡先を記載]
- **インフラチーム**: [連絡先を記載]
- **緊急連絡先**: [連絡先を記載]

## 参考資料

- [ConoHa VPS セットアップガイド](./conoha_vps_setup.md)
- [Rails Guides - デプロイ](https://guides.rubyonrails.org/deployment.html)
- [Puma ドキュメント](https://github.com/puma/puma)
- [Nginx ドキュメント](https://nginx.org/en/docs/)
