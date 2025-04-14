# 🔐 GeneratePlan ミューテーション 認証連携・ユーザー関連付け実装

## ✅ 概要
`GeneratePlan` ミューテーション実行時に、GraphQLの `context[:current_user]` を利用して認証チェックを行い、認証済みユーザーのみがプラン生成を実行できるようにします。また、生成されたプランにユーザー情報を紐付け、データベースに保存します。

## 🎯 実装内容

### バックエンド実装

1. **GeneratePlan ミューテーションの修正**
   - `context[:current_user]` を確認し、未認証の場合はエラーを返す
   - 認証済みの場合は、生成されたプランに `user_id` を自動的に付与

2. **PlanGenerator サービスの修正**
   - プラン生成時に固定IDを使用せず、データベースの自動採番を利用するよう修正
   - 生成されたプランをデータベースに保存する処理を追加

3. **テストの追加**
   - 未認証状態でのエラー処理のテスト
   - 認証済み状態でのプラン生成とユーザー関連付けのテスト

### フロントエンド実装

1. **SearchContainer コンポーネントの修正**
   - 認証エラー発生時にログインページへリダイレクト
   - リダイレクト時に現在のURLをクエリパラメータとして渡し、ログイン後に元のページに戻れるようにする

## 📝 実装詳細

### バックエンド

#### GeneratePlan ミューテーション

```ruby
def resolve(districts:, date:, member_info:, budget:, start_time: nil, end_time: nil, custom_options: nil)
  # 認証チェック
  unless context[:current_user]
    return { plan: nil, errors: ["ログインが必要です"] }
  end

  # プラン生成サービスを呼び出す
  plan_generator = Services::PlanGenerator.new(
    districts: districts,
    date: date,
    member_info: member_info,
    budget: budget,
    start_time: start_time,
    end_time: end_time,
    custom_options: custom_options,
    user: context[:current_user] # ユーザー情報を渡す
  )

  begin
    generated_plan = plan_generator.generate
    { plan: generated_plan, errors: [] }
  rescue => e
    { plan: nil, errors: [e.message] }
  end
end
```

#### PlanGenerator サービス

```ruby
# PlanGeneratorクラスの初期化
def initialize(districts:, date:, member_info:, budget:, start_time: nil, end_time: nil, custom_options: nil, user: nil)
  @districts = districts
  @date = Date.parse(date)
  @member_info = member_info
  @budget = budget
  @start_time = start_time ? Time.parse("#{date} #{start_time}") : Time.parse("#{date} 09:00")
  @end_time = end_time ? Time.parse("#{date} #{end_time}") : Time.parse("#{date} 21:00")
  @custom_options = custom_options || {}
  @total_available_time = (@end_time - @start_time) / 60 # 分単位
  @user = user # ユーザー情報を保持
end

# プラン生成メソッド内
# PlayPlanを作成
play_plan = PlayPlan.new(
  user_id: @user&.id, # ユーザーIDを設定
  plan_name: plan_name,
  description: "#{@date.strftime('%Y年%m月%d日')}の#{plan_name}です。",
  status: 'draft',
  start_datetime: @start_time,
  end_datetime: end_datetime,
  total_budget: total_budget,
  trip_type: 'day_trip'
)

# トランザクションでプランとその詳細を保存
ActiveRecord::Base.transaction do
  # プランをデータベースに保存
  play_plan.save!

  # PlanDetailとTravelDetailを作成
  # ...詳細コード省略...
end
```

### フロントエンド

#### SearchContainer コンポーネント

```typescript
// 生成されたプランを設定
if (data.generatePlan.errors && data.generatePlan.errors.length > 0) {
  // 認証エラーの場合はログインページにリダイレクト
  if (data.generatePlan.errors.some((error: string) => error.includes('ログインが必要'))) {
    // 現在のURLをクエリパラメータとして渡し、ログイン後に戻れるようにする
    const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
    router.push(`/login?returnUrl=${returnUrl}`);
    return;
  }

  setErrorMessage(data.generatePlan.errors.join(', '));
  return;
}
```

## 🧪 テスト

```ruby
RSpec.describe Mutations::GeneratePlan, type: :request do
  describe '認証チェック' do
    context '未ログイン状態' do
      it 'エラーを返す' do
        # テスト内容
      end
    end

    context 'ログイン状態' do
      it 'プランを生成し、ユーザーと関連付ける' do
        # テスト内容
      end
    end
  end
end
```

## 📋 今後の課題

1. **プラン編集機能の実装**
   - 生成・保存されたプランを後から編集する機能
   - ユーザーが作成したプランの編集・削除権限の実装

2. **プラン共有機能の実装**
   - 生成したプランを他ユーザーと共有する機能
   - 共有されたプランへのコメント機能

3. **マイページでのプラン管理**
   - ユーザーが生成したプランの一覧表示
   - プランのステータス管理（下書き/公開）
