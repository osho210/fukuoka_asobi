## 1. ログの基本方針

このプロダクトでは、ログを以下の目的で利用する。

| 目的 | 内容 |
| --- | --- |
| 障害対応 | 外部API連携、AI分析、同期処理の失敗原因を追跡する |
| セキュリティ監査 | 誰がどのデータにアクセスしたかを追跡する |
| ユーザー行動分析 | PMがどの機能を使っているかを把握する |
| パフォーマンス改善 | API、同期処理、AI分析の処理時間を把握する |

ログは「何のために取るのか」を先に決めるべきで、障害対応・セキュリティ監査・ユーザー行動分析・パフォーマンス改善は代表的な目的として整理されています。

---

## 2. 採用するログ形式

**構造化ログ（JSON）を採用する。**

理由：

- Cloud Loggingで検索・フィルタしやすい
- ログメッセージ依存の監視を避けられる
- AI分析にも渡しやすい
- 監査ログとして扱いやすい

構造化ログはマシンリーダブルで、検索やフィルタに向いている一方、非構造化ログよりデータ量が増える点には注意が必要です。

---

## 3. ログに必ず含める項目

```
{
  "timestamp":"2026-05-05T10:00:00.000Z",
  "level":"info",
  "log_type":"application",
  "event_name":"backlog_issues_synced",
  "request_id":"req_xxx",
  "trace_id":"trace_xxx",
  "user_id":"user_xxx",
  "team_id":"team_xxx",
  "resource_type":"backlog_issue",
  "resource_id":"ISSUE-123",
  "action":"sync",
  "status":"success",
  "duration_ms":1240,
  "external_service":"backlog",
  "error_code":null
}
```

特に大事なのはこれです。

| 項目 | 目的 |
| --- | --- |
| request_id | 1リクエストの追跡 |
| trace_id | 複数処理をまたぐ追跡 |
| user_id | 誰が実行したか |
| team_id | どのチームの処理か |
| event_name | 何が起きたか |
| log_type | ログ種別 |
| status | 成功/失敗 |
| duration_ms | 性能分析 |
| external_service | Backlog/GitHub/Slackなどの連携先 |

---

## 4. ログ種別

今回のプロダクトでは、最低限この4種類に分けるのが良いです。

| log_type | 用途 |
| --- | --- |
| application | 通常のアプリ処理 |
| audit | セキュリティ監査 |
| performance | 処理時間・遅延分析 |
| external_api | Backlog/GitHub/Slack/Gemini連携 |

参考記事でも、アプリケーションログ、トランザクションログ、監査ログ、アクセスログ、パフォーマンスログなど、目的別にログ種別を分ける考え方が整理されています。

---

## 5. ログ出力単位

ここは少し方針を整理した方が良いです。

### 原則

**リクエストまたは重要処理1つにつき、意味のあるログを1つ以上出す。**

ただし、関数単位で無条件にログを出すのは避ける。

## おすすめ

| 単位 | 出すか |
| --- | --- |
| APIリクエスト開始/終了 | 出す |
| 外部API同期開始/終了 | 出す |
| AI分析開始/終了 | 出す |
| 権限変更・連携設定変更 | 必ず出す |
| 小さなprivate関数 | 基本出さない |
| 例外発生 | 必ず出す |

つまり、

> 関数単位ではなく、業務イベント単位でログを出す
>

が良いです。

---

## 6. ログレベル設計

| level | 用途 | 例 |
| --- | --- | --- |
| debug | 開発時の詳細確認 | 外部APIレスポンス概要 |
| info | 正常な重要イベント | 同期成功、分析完了 |
| warn | 継続可能な異常 | API rate limit接近、一部同期失敗 |
| error | 処理失敗 | Backlog同期失敗、DB保存失敗 |
| fatal | システム継続不可 | 起動失敗、必須設定欠落 |

ログレベルはチームで一貫したルールを決めることが重要で、サービス横断で検索やアラート管理をする場合に混乱を避けやすくなります。

---

## 7. 監視はメッセージに依存しない

これはかなり重要です。

悪い例：

```
"Backlog sync failed"
```

この文字列を監視条件にする。

良い例：

```
{
  "event_name":"backlog_sync_failed",
  "level":"error",
  "external_service":"backlog",
  "status":"failed",
  "error_code":"BACKLOG_API_TIMEOUT"
}
```

監視条件は以下を見る。

- `level`
- `event_name`
- `status`
- `error_code`
- `external_service`
- `duration_ms`

---

## 8. 機密情報・個人情報の扱い

ログには原則として以下を出さない。

- APIキー
- OAuth token
- Slackメッセージ本文全文
- Backlog課題本文全文
- GitHub private repoのコード差分全文
- メールアドレス
- 個人評価に見えるAI出力の全文

必要な場合は、

- IDのみ残す
- 一部マスクする
- 要約だけ残す
- 保存先をDBに分ける

個人情報や機密情報は原則ログに書かず、必要最小限にするかマスクする方針が推奨されています。

---

# このプロダクト特有のログ例

## Backlog同期ログ

```
{
  "level":"info",
  "log_type":"external_api",
  "event_name":"backlog_issues_synced",
  "team_id":"team_001",
  "project_id":"project_001",
  "external_service":"backlog",
  "synced_count":42,
  "status":"success",
  "duration_ms":1880
}
```

## AI分析ログ

```
{
  "level":"info",
  "log_type":"application",
  "event_name":"risk_analysis_completed",
  "team_id":"team_001",
  "analysis_type":"delay_risk",
  "target_count":12,
  "model":"gemini",
  "status":"success",
  "duration_ms":3420
}
```

## 監査ログ

```
{
  "level":"info",
  "log_type":"audit",
  "event_name":"integration_token_updated",
  "user_id":"user_001",
  "team_id":"team_001",
  "resource_type":"integration",
  "external_service":"github",
  "action":"update_token",
  "status":"success"
}
```

---

> 本プロダクトでは、障害対応・監査・行動分析・性能改善を目的として構造化ログを採用する。ログは自然文メッセージではなく、event_name / log_type / status / error_code などの機械処理可能な項目を中心に設計し、機密情報・個人情報は原則出力しない。
>

- メモ

    「いつ」「誰が」「何をして」「どのような状況で」発生したログなのかがわかるようにする

    - リクエストや処理1つにつき情報を詰め込んだログを1つ出力する
    - 関数単位でログを出力する
    - ログ監視はログメッセージに依存しない設計に

    ログの目的

    - 障害対応・・・ DevOpsという文脈
    - セキュリティ監査・・・
    - ユーザー行動分析・・・今回のハッカソンは対象外かな
    - パフォーマンス改善・・・ DevOpsという文脈

    ログの種類

    - アプリケーションログ
    - トランザクションログ
    - パフォーマンスログ

    ログ設計

    - 構造化ログを採用する (今後Aiを使って対応することも増えるだろうが、パースの手間を省けるしね。。。)
    
    ログレベル設計

    あと機密情報はマスクしないとね。。。


### 参考にした記事

- https://zenn.dev/ncdc/articles/practical-logging-design-fundamentals
- https://qiita.com/tadashiro_ninomiya/items/19c774898c68add6185e
- https://gihyo.jp/article/2026/02/production-ready-logging-strategy