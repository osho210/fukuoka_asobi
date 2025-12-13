module Mutations
  class UpdatePlayPlanWithDetails < BaseMutation
    description "プラン詳細の一括更新（作成・更新・削除）"

    # 入力フィールド
    argument :id, ID, required: true, description: "プランID"
    argument :plan_name, String, required: false, description: "プラン名"
    argument :description, String, required: false, description: "プラン説明"
    argument :departure, String, required: false, description: "出発地点"
    argument :departure_time, String, required: false, description: "集合時間"
    argument :travel_method_to_first_spot, String, required: false, description: "最初の目的地までの移動手段"
    argument :travel_time_to_first_spot, Integer, required: false, description: "最初の目的地までの移動時間（分）"
    argument :status, Types::StatusEnumType, required: false, description: "ステータス（公開／下書き）"
    argument :trip_type, Types::TripTypeEnum, required: false, description: "旅行タイプ（日帰り／泊まり）"
    argument :total_budget, Float, required: false, description: "総予算"
    argument :location, String, required: false, description: "場所"
    argument :start_date, String, required: false, description: "開始日"
    argument :end_date, String, required: false, description: "終了日"
    argument :image_url, String, required: false, description: "画像URL"
    argument :images, [String], required: false, description: "画像リスト（Base64形式）"
    argument :delete_image_ids, [ID], required: false, description: "削除する画像IDリスト"
    argument :tags, String, required: false, description: "タグ"
    argument :recommend_users, [ID], required: false, description: "おすすめ対象IDリスト"
    argument :plan_details, [Types::PlanDetailInputType], required: false, description: "プラン詳細リスト"
    argument :deleted_plan_detail_ids, [ID], required: false, description: "削除するプラン詳細IDリスト"

    # 出力フィールド
    field :play_plan, Types::PlayPlanType, null: true, description: "更新されたプラン"
    field :errors, [Types::FieldErrorType], null: false, description: "エラー情報"
    field :success, Boolean, null: false, description: "処理成功フラグ"

    def resolve(**args)
      # 現在のユーザーを取得
      current_user = context[:current_user]

      # プランの存在確認
      play_plan = PlayPlan.find_by(id: args[:id])
      unless play_plan
        return {
          play_plan: nil,
          errors: [
            {
              field: "id",
              message: "指定されたプランが見つかりません"
            }
          ],
          success: false
        }
      end

      # 権限チェック（必要に応じて）
      # if current_user && play_plan.user_id != current_user.id
      #   return {
      #     play_plan: nil,
      #     errors: [
      #       {
      #         field: "authorization",
      #         message: "このプランを編集する権限がありません"
      #       }
      #     ],
      #     success: false
      #   }
      # end

      # サービスを実行
      service = UpdatePlayPlanWithDetailsService.new(args, current_user)
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
      Rails.logger.error "UpdatePlayPlanWithDetails Error: #{e.message}"
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
