# 🔐 有償ユーザー ＆ 作成者のみ閲覧可能なプラン詳細ページ制御 設計書

## 🎯 目的
`/plans/:id` に対応する GraphQL クエリやページにおいて、**有償ユーザー または プラン作成者本人**のみが閲覧できるように制御する。

---

## 🗃️ 条件ロジック

### アクセスを許可する条件（いずれかを満たす）

- `current_user.paid_member? == true`
- `current_user.id == plan.user_id`

---

## 🧠 GraphQL リゾルバの実装

```ruby
def resolve(id:)
  user = context[:current_user]
  raise GraphQL::ExecutionError, "ログインが必要です" unless user

  plan = PlayPlan.find_by(id: id)
  raise GraphQL::ExecutionError, "該当プランが見つかりません" unless plan

  unless user.paid_member? || user.id == plan.user_id
    raise GraphQL::ExecutionError, "こちらのページは課金しないと見れません"
  end

  plan
rescue StandardError => e
  Rails.logger.error("PlayPlanResolver error: #{e.message}")
  raise GraphQL::ExecutionError, e.message
end
```

---

## 🖥️ フロントエンド実装

### エラーメッセージの表示

プラン詳細ページでは、GraphQLエラーの内容に応じて以下のように表示を分岐：

1. **未ログインエラー**：
   - メッセージ：「ログインが必要です」
   - アクション：ログインページへのリンク、新規登録ページへのリンク

2. **有償会員限定エラー**：
   - メッセージ：「有償会員限定コンテンツ」
   - 説明：「このプランは有償会員または作成者本人のみが閲覧できます」
   - アクション：有償会員登録ページへのリンク、他のプラン一覧へのリンク

3. **その他のエラー**：
   - メッセージ：エラー内容をそのまま表示
   - アクション：戻るボタン

---

## 🧪 テスト観点

| ユーザー状態 | 結果 |
|------------|------|
| 未ログイン | エラー：「ログインが必要です」 |
| ログイン済み & 有償ユーザー | プラン詳細を表示 |
| ログイン済み & 無償ユーザー & 作成者本人 | プラン詳細を表示 |
| ログイン済み & 無償ユーザー & 他人のプラン | エラー：「こちらのページは課金しないと見れません」 |

---

## 📝 実装ファイル

### バックエンド
- `backend/app/graphql/resolvers/play_plan_resolver.rb`：リゾルバの実装
- `backend/spec/graphql/resolvers/play_plan_resolver_spec.rb`：テストの実装

### フロントエンド
- `frontend/src/app/plans/[id]/page.tsx`：プラン詳細ページの実装
- `frontend/src/styles/PlayPlanDetail.css`：エラー表示用のスタイル

---

## 🔄 今後の拡張性

1. **アクセス制御の拡張**：
   - 管理者権限によるアクセス許可
   - 期間限定無料公開の仕組み

2. **UI/UX改善**：
   - 有償会員登録への誘導強化
   - プレビュー機能（一部のみ無料表示）

3. **アクセス解析**：
   - 有償会員限定コンテンツへのアクセス試行の記録
   - コンバージョン率の計測
