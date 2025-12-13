module Mutations
  class CreateOrUpdatePlayPlanWithDetails < BaseMutation
    description "プラン一括作成・更新"

    # 入力フィールド
    argument :id, ID, required: false, description: "プランID（更新時のみ）"
    argument :plan_name, String, required: true, description: "プラン名"
    argument :catch_copy, String, required: false, description: "キャッチコピー"
    argument :subtitle, String, required: false, description: "サブタイトル"
    argument :lead_text, String, required: false, description: "リードテキスト"
    argument :description, String, required: false, description: "プラン説明"
    argument :departure, String, required: false, description: "出発地点"
    argument :departure_time, String, required: false, description: "集合時間"
    argument :travel_method_to_first_spot, String, required: false, description: "最初の目的地までの移動手段"
    argument :travel_time_to_first_spot, Integer, required: false, description: "最初の目的地までの移動時間（分）"
    argument :status, Types::StatusEnumType, required: true, description: "ステータス（公開／下書き）"
    argument :trip_type, Types::TripTypeEnum, required: true, description: "旅行タイプ（日帰り／泊まり）"
    argument :total_budget, Float, required: false, description: "総予算"
    argument :location, String, required: false, description: "場所"
    argument :start_time, String, required: false, description: "開始日時"
    argument :end_time, String, required: false, description: "終了日時"
    argument :image_url, String, required: false, description: "画像URL"
    argument :images, [String], required: false, description: "新規画像のBase64エンコード文字列配列"
    argument :delete_image_ids, [ID], required: false, description: "削除対象画像IDリスト"
    argument :tags, String, required: false, description: "タグ"
    argument :recommend_users, [ID], required: false, description: "おすすめ対象IDリスト"
    argument :planner_title, String, required: false, description: "プランナータイトル"
    argument :planner_description, String, required: false, description: "プランナー説明"
    argument :is_recommended, Boolean, required: false, description: "編集部おすすめフラグ"
    argument :plan_details, [Types::PlanDetailInputType], required: true, description: "プラン詳細リスト"
    argument :image_properties, [Mutations::Inputs::ImagePropertyInputType], required: false, description: "画像プロパティリスト"

    # 出力フィールド
    field :play_plan, Types::PlayPlanType, null: true, description: "作成・更新されたプラン"
    field :errors, [Types::FieldErrorType], null: false, description: "エラー情報"
    field :success, Boolean, null: false, description: "処理成功フラグ"

    def resolve(**args)
      # 現在のユーザーを取得
      current_user = context[:current_user]

      # サービスを実行
      service = PlayPlanWithDetailsService.new(args, current_user)
      result = service.execute

      # レスポンスを構築
      {
        play_plan: result[:play_plan],
        errors: result[:errors].map do |error|
          {
            field: error[:field],
            message: error[:message]
          }
        end,
        success: result[:success]
      }
    rescue StandardError => e
      Rails.logger.error "CreateOrUpdatePlayPlanWithDetails Error: #{e.message}"
      Rails.logger.error e.backtrace.join("
")

      {
        play_plan: nil,
        errors: [
          {
            field: "system",
            message: "システムエラーが発生しました。管理者にお問い合わせください。"
          }
        ],
        success: false
      }
    end
  end
end
