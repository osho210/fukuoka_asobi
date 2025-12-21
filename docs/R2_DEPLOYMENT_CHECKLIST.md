# Cloudflare R2 デプロイチェックリスト

このチェックリストは、Cloudflare R2 への移行をスムーズに行うための確認事項をまとめたものです。

## デプロイ前の準備

### Cloudflare R2 のセットアップ

- [ ] Cloudflare Dashboard にログイン済み
- [ ] R2 Bucket `fukuoka-asobi-production` を作成済み
- [ ] R2 API Token を作成済み（Object Read & Write 権限）
- [ ] 以下の情報を取得済み：
  - [ ] Account ID
  - [ ] Access Key ID
  - [ ] Secret Access Key
- [ ] R2 エンドポイント URL を確認済み：`https://<ACCOUNT_ID>.r2.cloudflarestorage.com`

### ローカル環境の準備

- [ ] 環境変数 `R2_ENDPOINT` を設定済み（デプロイ実行マシン）
  ```bash
  export R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
  ```
- [ ] `.kamal/secrets` ファイルに以下を設定済み：
  ```
  R2_ACCESS_KEY_ID=<your-access-key-id>
  R2_SECRET_ACCESS_KEY=<your-secret-access-key>
  ```

### コードの確認

- [ ] `backend/config/storage.yml` に `r2_production` 設定が存在
- [ ] `backend/config/deploy.yml` の環境変数が R2 用に更新済み
- [ ] `docker-compose.prod.yml` から MinIO が削除済み
- [ ] `.env.production.example` が R2 用に更新済み

## デプロイ実行

### 1. 設定の確認

```bash
cd backend
kamal config
```

- [ ] エラーが出ないことを確認
- [ ] 環境変数が正しく設定されていることを確認

### 2. デプロイの実行

```bash
kamal deploy
```

- [ ] デプロイが正常に完了
- [ ] エラーログが出ていないことを確認

### 3. コンテナの確認

```bash
kamal app containers
```

- [ ] backend コンテナが起動していることを確認
- [ ] minio コンテナが起動していないことを確認（削除済みのため）

## デプロイ後の確認

### 1. Rails コンソールでの確認

```bash
kamal app exec --interactive "bin/rails console"
```

Rails コンソールで以下を実行：

```ruby
# ActiveStorage サービスの確認
ActiveStorage::Blob.service.class
# => ActiveStorage::Service::S3Service

# 設定の確認
Rails.application.config.active_storage.service
# => :r2_production

# 環境変数の確認
ENV['ACTIVE_STORAGE_SERVICE']
# => "r2_production"

ENV['R2_ENDPOINT']
# => "https://<ACCOUNT_ID>.r2.cloudflarestorage.com"

ENV['R2_BUCKET']
# => "fukuoka-asobi-production"
```

- [ ] すべての確認項目が正しい値を返す

### 2. テストアップロード（Rails コンソール）

```ruby
# テストファイルのアップロード
blob = ActiveStorage::Blob.create_and_upload!(
  io: File.open(Rails.root.join('public', '422.html')),
  filename: 'test.html',
  content_type: 'text/html'
)

# URL の生成確認
url = blob.url
puts url
# => 署名付き URL が返される（https://<ACCOUNT_ID>.r2.cloudflarestorage.com/...）

# クリーンアップ
blob.purge
```

- [ ] アップロードが成功
- [ ] 署名付き URL が生成される
- [ ] 削除が成功

### 3. 管理画面での動作確認

以下の各機能で画像アップロードをテスト：

- [ ] User モデル：プロフィール画像（avatar）のアップロード
- [ ] PlayPlan モデル：プラン画像（images）のアップロード
- [ ] Spot モデル：スポット画像（images）のアップロード
- [ ] Menu モデル：メニュー画像（image）のアップロード

各モデルで以下を確認：

- [ ] 画像のアップロードが成功
- [ ] アップロード済み画像が表示される
- [ ] 画像の削除が正常に動作

### 4. ログの確認

```bash
kamal app logs -f
```

- [ ] ActiveStorage 関連のエラーが出ていない
- [ ] R2 への接続エラーが出ていない
- [ ] 画像アップロード時のログが正常

## トラブルシューティング

### エラーが発生した場合

1. **ログの確認**
   ```bash
   kamal app logs -f
   ```

2. **Rails コンソールでデバッグ**
   ```bash
   kamal app exec --interactive "bin/rails console"
   ```

3. **環境変数の確認**
   ```ruby
   ENV.select { |k, v| k.start_with?('R2_') }
   ```

4. **ロールバック（必要な場合）**
   ```bash
   git revert HEAD
   git push
   kamal deploy
   ```

## MinIO のクリーンアップ（オプション）

R2 が正常に動作していることを確認してから実施：

### バックアップ（念のため）

```bash
# MinIO データのバックアップ（VPS 上で実行）
docker cp fukuoka-asobi-backend-minio:/data /backup/minio-data-$(date +%Y%m%d)
```

- [ ] バックアップが完了

### MinIO の削除

```bash
# Kamal の場合（accessory として管理されている場合）
kamal accessory stop minio
kamal accessory remove minio

# または Docker コマンドで直接削除
docker stop fukuoka-asobi-backend-minio
docker rm fukuoka-asobi-backend-minio
docker volume rm fukuoka-asobi-backend-minio-data
```

- [ ] MinIO コンテナが停止
- [ ] MinIO コンテナが削除
- [ ] MinIO ボリュームが削除

## 完了確認

すべてのチェック項目が完了したら、以下を確認：

- [ ] 本番環境で画像アップロードが正常に動作
- [ ] 既存の画像が表示される（MinIO に残っている場合）
- [ ] 新規アップロード画像が R2 に保存される
- [ ] エラーログに問題がない
- [ ] MinIO が削除されている（オプション）

## 参考ドキュメント

- 詳細な移行ガイド：[/docs/cloudflare_r2_migration.md](./cloudflare_r2_migration.md)
- Cloudflare R2 Documentation：https://developers.cloudflare.com/r2/
- Kamal Documentation：https://kamal-deploy.org/

## 連絡先

問題が発生した場合は、開発チームに連絡してください。
