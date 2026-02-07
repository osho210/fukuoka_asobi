# Dependabot設定ガイド

## 概要

このドキュメントでは、fukuoka_asobiプロジェクトのDependabot設定について説明します。

## 修正内容

### 修正前の問題点

1. **npmエコシステムの設定が完全に欠落**
   - プロジェクトはnpm workspaces（frontend/admin）を使用しているが、Dependabotの設定がなかった
   - これにより、JavaScriptライブラリの54件のセキュリティアラートに対するPRが作成されなかった

2. **Bundlerのディレクトリパスが間違っていた**
   - 設定: `directory: "/"`
   - 実際: `directory: "/backend"`
   - Gemfileは `/backend/Gemfile` に存在するため、Dependabotがファイルを見つけられなかった

3. **重複した設定ファイル**
   - `.github/dependabot.yml`
   - `backend/.github/dependabot.yml`
   - 重複により、設定の優先順位が不明確だった

4. **スケジュール設定が要件と異なる**
   - 設定: `interval: daily`
   - 要件: 毎週月曜日にまとめて実行

5. **プレースホルダーが残っていた**
   - `reviewers: ["your-github-id"]`
   - `assignees: ["your-github-id"]`
   - これらは無効な設定

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

  # 2. npm (root workspace) - /
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
      day: monday

  # 3. npm (frontend workspace) - /frontend
  - package-ecosystem: npm
    directory: "/frontend"
    schedule:
      interval: weekly
      day: monday

  # 4. npm (admin workspace) - /admin
  - package-ecosystem: npm
    directory: "/admin"
    schedule:
      interval: weekly
      day: monday

  # 5. GitHub Actions - /
  - package-ecosystem: github-actions
    directory: "/"
    schedule:
      interval: weekly
      day: monday
```

## 設定の詳細

### サポートされているエコシステム

| エコシステム | ディレクトリ | 管理対象ファイル | PRプレフィックス |
|------------|------------|----------------|-----------------|
| Bundler | `/backend` | `Gemfile`, `Gemfile.lock` | `deps/bundler/` |
| npm (root) | `/` | `package.json`, `package-lock.json` | `deps/npm/` |
| npm (frontend) | `/frontend` | `package.json` | `deps/npm-frontend/` |
| npm (admin) | `/admin` | `package.json` | `deps/npm-admin/` |
| GitHub Actions | `/` | `.github/workflows/*.yml` | `deps/gh-actions/` |

### スケジュール設定

- **実行タイミング**: 毎週月曜日
- **タイムゾーン**: UTC（デフォルト）
- **実行時刻**: 05:00 UTC（日本時間14:00頃）

### PR作成の設定

- **最大同時オープンPR数**: 各エコシステムあたり10件
- **ラベル**: `dependencies`, `bot`
- **コミットメッセージ**: `chore(scope): description`

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

### Dependabotがプロンプトを作成しない場合

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
| 2026-02-07 | 初回作成、設定の全面的な見直し | Copilot Agent |
