module Types
  class GeneratePlanInputType < Types::BaseInputObject
    graphql_name "GeneratePlanInputObject"
    description "プラン生成の入力パラメータ"

    argument :areas, [ID], required: true, description: "エリアID"
    argument :date, String, required: true, description: "日付（YYYY-MM-DD形式）"
    argument :member_info, Types::MemberInfoInputType, required: true, description: "利用メンバー情報"
    argument :budget, Types::BudgetInputType, required: true, description: "予算範囲"
    argument :start_time, String, required: false, description: "開始時間（HH:MM形式）"
    argument :end_time, String, required: false, description: "終了時間（HH:MM形式）"
    argument :custom_options, Types::CustomOptionsInputType, required: false, description: "カスタムオプション"
  end
end
