# SchemaSpy 使用ガイド

## 概要

SchemaSpy は、データベースのスキーマを分析し、ER図やテーブル間の関係などを視覚的に表示するツールです。このプロジェクトでは、Docker を使用して SchemaSpy を実行し、福岡遊び日記のデータベース設計を可視化します。

## セットアップ

すでに必要なファイルとディレクトリは作成されています：

- `docker-compose.yml` - SchemaSpy サービスの定義
- `schemaspy/config/schemaspy.properties` - SchemaSpy の設定ファイル
- `schemaspy/run-schemaspy.sh` - SchemaSpy 実行スクリプト
- `schemaspy/output/` - SchemaSpy の出力ディレクトリ

## 使用方法

### SchemaSpy の実行

1. プロジェクトのルートディレクトリで以下のコマンドを実行します：

```bash
./schemaspy/run-schemaspy.sh
```

2. スクリプトが実行され、SchemaSpy がデータベースのスキーマを分析します。
3. 実行が完了すると、結果が `schemaspy/output` ディレクトリに保存されます。

### 結果の確認

1. ブラウザで `schemaspy/output/index.html` ファイルを開きます：

```bash
open schemaspy/output/index.html
```

2. ブラウザで ER 図やテーブル定義などが表示されます。

## 主な機能

SchemaSpy の主な機能は以下の通りです：

- **ER図の生成**: データベース内のテーブル間の関係を視覚的に表示します。
- **テーブル定義**: 各テーブルの列定義、データ型、制約などを表示します。
- **インデックス情報**: テーブルのインデックス情報を表示します。
- **制約情報**: 主キー、外部キー、ユニーク制約などの情報を表示します。
- **統計情報**: テーブルのサイズや行数などの統計情報を表示します。

## カスタマイズ

SchemaSpy の設定をカスタマイズする場合は、`schemaspy/config/schemaspy.properties` ファイルを編集します。主な設定項目は以下の通りです：

- **特定のテーブルのみを含める**: `schemaspy.i=table1,table2` のように指定します。
- **特定のテーブルを除外する**: `schemaspy.I=table3,table4` のように指定します。
- **詳細なログを出力**: `schemaspy.debug=true` を設定します。
- **関係のないテーブルを非表示**: `schemaspy.noorphans=true` を設定します。

詳細な設定オプションについては、[SchemaSpy の公式ドキュメント](http://schemaspy.org/) を参照してください。

## トラブルシューティング

### データベースに接続できない場合

1. データベースが実行中であることを確認します：

```bash
docker-compose ps db
```

2. データベースの接続情報が正しいことを確認します：

```bash
docker-compose exec db mysql -u rails -prails -h localhost fukuoka_asobi_development -e "SHOW TABLES;"
```

### SchemaSpy の実行に失敗する場合

1. Docker ログを確認します：

```bash
docker-compose logs schemaspy
```

2. 設定ファイルのパラメータが正しいことを確認します。
3. 必要に応じて、`docker-compose.yml` の SchemaSpy サービス定義を修正します。
