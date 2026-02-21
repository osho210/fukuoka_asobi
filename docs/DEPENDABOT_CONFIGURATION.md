# Dependabot設定ガイド

## 概要

このドキュメントでは、fukuoka_asobiプロジェクトのDependabot設定について説明します。

## 修正内容

### 修正前の問題点

1. **npm workspacesの設定重複**
   - プロジェクトはnpm workspaces（frontend/admin）を使用しているが、root、frontend、adminを個別に設定していた
   - 個別設定により、Dependabotジョブが競合し、「Waiting for a runner to pick up this job...」のまま処理されなかった
   - GitHubの公式ドキュメントでは、npm workspacesを使用している場合、**ルートディレクトリのみを管理する**ことが推奨されている

### 修正後の設定

```yaml
version: 2
updates:
  # 1. Bundler (Ruby/Rails backend) - /backend
  - package-ecosystem: bundler
    directory: "/backend"
    schedule:
      interval: weekly
      day: monday

  # 2. npm (manages root + all workspaces: frontend, admin) - /
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
      day: monday

  # 3. GitHub Actions - /
  - package-ecosystem: github-actions
    directory: "/"
    schedule:
      interval: weekly
      day: monday
```

**重要な変更点**：
- npm workspacesを使用しているため、**ルートディレクトリ（`/`）のみ**を管理
- `/frontend`と`/admin`の個別設定を削除
- ルートの`package.json`を管理することで、すべてのworkspace（frontend, admin）の依存関係が自動的に更新される

## 設定の詳細

### サポートされているエコシステム

| エコシステム | ディレクトリ | 管理対象ファイル | 管理範囲 |
|------------|------------|-----------------|---------|
| Bundler | `/backend` | `Gemfile`, `Gemfile.lock` | Rubyの依存関係 |
| npm | `/` | `package.json`, `package-lock.json` | ルート + 全workspaces（frontend, admin） |
| GitHub Actions | `/` | `.github/workflows/*.yml` | GitHub Actionsのバージョン |

### スケジュール設定

- **実行タイミング**: 毎週月曜日
- **タイムゾーン**: UTC（デフォルト）
- **実行時刻**: 05:00 UTC（日本時間14:00頃）

### PR作成の設定

- **最大同時オープンPR数**: 各エコシステムあたり10件
- **ラベル**: `dependencies`, `bot`
- **コミットメッセージ**: `chore(scope): description`

### npm workspacesに関する重要な注意事項

このプロジェクトはnpm workspacesを使用しています：
- ルートの`package.json`に`"workspaces": ["frontend", "admin"]`が定義されている
- Dependabotでルートディレクトリ（`/`）を管理すると、**すべてのworkspaceの依存関係が自動的に更新される**
- 個別のworkspaceディレクトリ（`/frontend`, `/admin`）を設定すると、ジョブが競合してPRが作成されなくなる

**推奨設定**：
```yaml
# ✅ 正しい設定（ルートのみ）
- package-ecosystem: npm
  directory: "/"

# ❌ 誤った設定（個別workspace）
- package-ecosystem: npm
  directory: "/frontend"  # 削除すべき
- package-ecosystem: npm
  directory: "/admin"     # 削除すべき
```

## Dependabotの動作確認

### 1. 設定ファイルの確認

GitHubリポジトリの設定から確認できます：

```
https://github.com/osho210/fukuoka_asobi/network/updates
```

### 2. 次回の実行予定

- 次の月曜日（UTC時間）にDependabotが自動実行されます
- 最初の実行では、多数のPRが作成される可能性があります

### 3. 手動でトリガー

GitHub UIから手動でDependabotをトリガーできます：

1. リポジトリの「Insights」タブを開く
2. 「Dependency graph」→「Dependabot」を選択
3. 各エコシステムの「Check for updates」ボタンをクリック

### 4. PRの確認

Dependabotが作成したPRは以下の特徴があります：

- タイトル: `chore(deps): bump [package-name] from [old-version] to [new-version]`
- ラベル: `dependencies`, `bot`
- ブランチ名: `deps/[ecosystem]/[package-name]-[version]`

## セキュリティアップデートについて

### 現在のアラート

プロジェクトには54件のセキュリティアラートが存在します。これらは主に：

- npm dependencies（frontend/admin）
- Ruby gems（backend）
- GitHub Actions

### 優先度の高いアップデート

Dependabotは以下の順序でアップデートを提案します：

1. **Critical**: 重大な脆弱性（CVSS 9.0-10.0）
2. **High**: 高リスクの脆弱性（CVSS 7.0-8.9）
3. **Medium**: 中リスクの脆弱性（CVSS 4.0-6.9）
4. **Low**: 低リスクの脆弱性（CVSS 0.1-3.9）

### アップデートの適用手順

1. Dependabotが作成したPRを確認
2. 変更内容とセキュリティアラートを確認
3. CI/CDが通過することを確認
4. レビュー後、マージ

## トラブルシューティング

### DependabotがPRを作成しない場合

#### 原因1: 設定ファイルのシンタックスエラー

```bash
# ローカルで検証
python3 -c "import yaml; yaml.safe_load(open('.github/dependabot.yml'))"
```

#### 原因2: ディレクトリパスが間違っている

各エコシステムのファイルが正しい場所に存在するか確認：

```bash
# Bundler
ls -la backend/Gemfile backend/Gemfile.lock

# npm (root)
ls -la package.json package-lock.json

# npm (frontend)
ls -la frontend/package.json

# npm (admin)
ls -la admin/package.json

# GitHub Actions
ls -la .github/workflows/
```

#### 原因3: GitHub Actionsの権限

リポジトリの設定で、Dependabotに必要な権限が付与されているか確認：

1. Settings → Actions → General
2. 「Workflow permissions」が「Read and write permissions」になっているか確認
3. 「Allow GitHub Actions to create and approve pull requests」にチェックが入っているか確認

### PRが多すぎる場合

`open-pull-requests-limit` を調整できます：

```yaml
- package-ecosystem: npm
  directory: "/"
  schedule:
    interval: weekly
    day: monday
  open-pull-requests-limit: 5  # デフォルトは10
```

### 特定のパッケージを除外したい場合

```yaml
- package-ecosystem: npm
  directory: "/"
  schedule:
    interval: weekly
    day: monday
  ignore:
    - dependency-name: "package-name"
      versions: ["1.x", "2.x"]
```

## ベストプラクティス

### 1. 定期的なレビュー

- 毎週月曜日（日本時間14:00頃）にDependabotのPRを確認
- セキュリティアラートを優先的に対応

### 2. CI/CDとの統合

- すべてのDependabot PRに対してCI/CDを実行
- テストが通過したPRを優先的にマージ

### 3. グループアップデート（将来的な改善案）

複数の依存関係を1つのPRにまとめることができます：

```yaml
groups:
  dev-dependencies:
    patterns:
      - "@types/*"
      - "@storybook/*"
```

### 4. バージョン管理戦略

- Major updates: 慎重にレビュー（破壊的変更の可能性）
- Minor updates: 機能追加、比較的安全
- Patch updates: バグフィックス、セキュリティパッチ（優先的にマージ）

## 参考リンク

- [Dependabot公式ドキュメント](https://docs.github.com/en/code-security/dependabot)
- [設定オプション](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [npm workspacesとの統合](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/keeping-your-actions-up-to-date-with-dependabot)

## 変更履歴

| 日付 | 変更内容 | 担当者 |
|------|---------|--------|
| 2026-02-21 | npm workspaces対応の最適化（個別workspace設定を削除） | Copilot Agent |
| 2026-02-07 | 初回作成、設定の全面的な見直し | Copilot Agent |
