# SchemaSpy

このディレクトリには、データベース構造を可視化するためのSchemaSpy関連ファイルが含まれています。

## 概要

SchemaSpyは、データベースのスキーマを分析し、HTML形式のドキュメントとして出力するツールです。テーブル間のリレーションシップ、カラム情報、インデックスなどを視覚的に確認することができます。

## ディレクトリ構成

```
schemaspy/
├── config/             # SchemaSpy設定ファイル
│   └── schemaspy.properties  # 主要設定ファイル
├── output/             # 生成されたER図などの出力
│   ├── index.html      # メインインデックスページ
│   ├── diagrams/       # 図表ディレクトリ
│   │   ├── summary/    # 概要図
│   │   └── tables/     # テーブル図
│   └── tables/         # テーブル情報
└── run-schemaspy.sh    # 実行スクリプト
```

## 設定ファイル

`config/schemaspy.properties`には以下の主要な設定が含まれています：

- データベース接続設定（ホスト、ポート、ユーザー名、パスワードなど）
- 出力設定
- テーブル設定（特定のテーブルの包含/除外）
- その他の設定（デバッグモード、文字セットなど）

## 使用方法

### ER図の生成

以下のコマンドを実行して、データベースのER図を生成します：

```bash
./schemaspy/run-schemaspy.sh
```

このスクリプトは以下の処理を行います：

1. 既存のSchemaSpy Dockerコンテナを停止・削除（存在する場合）
2. SchemaSpy Dockerコンテナを実行
3. データベースに接続してスキーマを分析
4. HTML形式のドキュメントを`./schemaspy/output`ディレクトリに生成

### 結果の確認

生成されたドキュメントは以下の方法で確認できます：

1. ブラウザで`./schemaspy/output/index.html`を開く
2. 各テーブルの詳細情報、リレーションシップ図、カラム情報などを閲覧

## 主要な出力ファイル

- `index.html`: メインインデックスページ
- `tables/[テーブル名].html`: 各テーブルの詳細情報
- `diagrams/summary/relationships.real.large.svg`: 全体のER図（大）
- `diagrams/summary/relationships.real.compact.svg`: 全体のER図（コンパクト）
- `diagrams/tables/[テーブル名].1degree.svg`: 特定テーブルとその直接の関連テーブルを表示

## 注意事項

- SchemaSpy実行にはDockerが必要です
- データベースが起動していることを確認してから実行してください
- 大規模なデータベースの場合、生成に時間がかかることがあります

## カスタマイズ

必要に応じて`config/schemaspy.properties`ファイルを編集することで、出力内容をカスタマイズできます：

- 特定のテーブルのみを含める/除外する
- 出力形式や詳細レベルを変更する
- メタデータを追加する
