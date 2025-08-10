class PlayPlanWithDetailsService
  attr_reader :play_plan, :errors

  def initialize(params, current_user = nil)
    @params = params.to_h.with_indifferent_access
    @current_user = current_user
    @play_plan = nil
    @errors = []
  end

  def execute
    ActiveRecord::Base.transaction do
      # 1. PlayPlan の作成・更新
      process_play_plan!

      # 2. PlanDetail の作成・更新・削除
      process_plan_details!

      # 3. TravelDetail の作成・更新・削除
      process_travel_details!

      # 4. 画像処理
      process_images!

      # 5. バリデーション
      validate_all!

      raise ActiveRecord::Rollback if @errors.any?
    end

    build_response
  end

  def success?
    @errors.empty?
  end

  private

  def process_play_plan!
    plan_attrs = @params.except(:id, :plan_details, :recommend_users)
    plan_attrs[:user_id] = @current_user&.id

    if @params[:id].present?
      # 更新
      @play_plan = PlayPlan.find_by(id: @params[:id])
      unless @play_plan
        @errors << { field: "id", message: "指定されたプランが見つかりません" }
        return
      end

      unless @play_plan.update(plan_attrs)
        @play_plan.errors.each do |error|
          @errors << { field: error.attribute.to_s, message: error.full_message }
        end
      end
    else
      # 新規作成
      @play_plan = PlayPlan.new(plan_attrs)
      unless @play_plan.save
        @play_plan.errors.each do |error|
          @errors << { field: error.attribute.to_s, message: error.full_message }
        end
      end
    end

    # おすすめ対象の関連付け
    process_recommended_fors! if @play_plan&.persisted?
  end

  def process_recommended_fors!
    return unless @params[:recommend_users].present?

    @play_plan.play_plan_recommended_fors.destroy_all
    @params[:recommend_users].each do |recommended_for_id|
      recommended_for = RecommendedFor.find_by(id: recommended_for_id)
      if recommended_for
        @play_plan.recommended_fors << recommended_for
      else
        @errors << { field: "recommend_users", message: "ID #{recommended_for_id} のおすすめ対象が見つかりません" }
      end
    end
  end

  def process_plan_details!
    return unless @play_plan&.persisted? && @params[:plan_details].present?

    existing_detail_ids = @play_plan.plan_details.pluck(:id)
    input_detail_ids = @params[:plan_details].filter_map { |detail| detail[:id]&.to_i }

    # 削除対象のPlanDetailを削除
    details_to_delete = existing_detail_ids - input_detail_ids
    PlanDetail.where(id: details_to_delete).destroy_all

    # 各PlanDetailを処理
    @params[:plan_details].each_with_index do |detail_params, index|
      process_single_plan_detail!(detail_params, index)
    end
  end

  def process_single_plan_detail!(detail_params, index)
    detail_params_hash = detail_params.to_h.with_indifferent_access
    detail_attrs = detail_params_hash.except(:id, :travel_details)
    detail_attrs[:plan_id] = @play_plan.id

    # 日時バリデーション
    if detail_attrs[:start_datetime] && detail_attrs[:end_datetime]
      if detail_attrs[:start_datetime] >= detail_attrs[:end_datetime]
        @errors << {
          field: "plan_details[#{index}].start_datetime",
          message: "開始時間は終了時間より前である必要があります"
        }
        return
      end
    end

    # スポット存在チェック
    if detail_attrs[:spot_id].present?
      unless Spot.exists?(id: detail_attrs[:spot_id])
        @errors << {
          field: "plan_details[#{index}].spot_id",
          message: "指定されたスポットが見つかりません"
        }
        return
      end
    end

    if detail_params[:id].present?
      # 更新
      plan_detail = PlanDetail.find_by(id: detail_params[:id], plan_id: @play_plan.id)
      unless plan_detail
        @errors << {
          field: "plan_details[#{index}].id",
          message: "指定されたプラン詳細が見つかりません"
        }
        return
      end

      unless plan_detail.update(detail_attrs)
        plan_detail.errors.each do |error|
          @errors << {
            field: "plan_details[#{index}].#{error.attribute}",
            message: error.full_message
          }
        end
      end
    else
      # 新規作成
      plan_detail = PlanDetail.new(detail_attrs)
      unless plan_detail.save
        plan_detail.errors.each do |error|
          @errors << {
            field: "plan_details[#{index}].#{error.attribute}",
            message: error.full_message
          }
        end
      end
    end
  end

  def process_travel_details!
    return unless @play_plan&.persisted? && @params[:plan_details].present?

    @params[:plan_details].each_with_index do |detail_params, detail_index|
      next unless detail_params[:travel_details].present?

      plan_detail_id = if detail_params[:id].present?
                         detail_params[:id]
                       else
                         # 新規作成されたPlanDetailのIDを取得
                         @play_plan.plan_details.find_by(step_number: detail_params[:step_number])&.id
                       end

      next unless plan_detail_id

      process_travel_details_for_plan_detail!(
        plan_detail_id,
        detail_params[:travel_details],
        detail_index
      )
    end
  end

  def process_travel_details_for_plan_detail!(plan_detail_id, travel_details_params, detail_index)
    existing_travel_ids = TravelDetail.where(plan_detail_id: plan_detail_id).pluck(:id)
    input_travel_ids = travel_details_params.filter_map { |travel| travel[:id]&.to_i }

    # 削除対象のTravelDetailを削除
    travels_to_delete = existing_travel_ids - input_travel_ids
    TravelDetail.where(id: travels_to_delete).destroy_all

    # 各TravelDetailを処理
    travel_details_params.each_with_index do |travel_params, travel_index|
      process_single_travel_detail!(travel_params, plan_detail_id, detail_index, travel_index)
    end
  end

  def process_single_travel_detail!(travel_params, plan_detail_id, detail_index, travel_index)
    travel_params_hash = travel_params.to_h.with_indifferent_access
    travel_attrs = travel_params_hash.except(:id)
    travel_attrs[:plan_detail_id] = plan_detail_id

    # 移動方法バリデーション
    valid_methods = %w[徒歩 電車 車 自転車 その他]
    unless valid_methods.include?(travel_attrs[:travel_method])
      @errors << {
        field: "plan_details[#{detail_index}].travel_details[#{travel_index}].travel_method",
        message: "移動方法は#{valid_methods.join('、')}のいずれかを選択してください"
      }
      return
    end

    if travel_params[:id].present?
      # 更新
      travel_detail = TravelDetail.find_by(id: travel_params[:id], plan_detail_id: plan_detail_id)
      unless travel_detail
        @errors << {
          field: "plan_details[#{detail_index}].travel_details[#{travel_index}].id",
          message: "指定された移動詳細が見つかりません"
        }
        return
      end

      unless travel_detail.update(travel_attrs)
        travel_detail.errors.each do |error|
          @errors << {
            field: "plan_details[#{detail_index}].travel_details[#{travel_index}].#{error.attribute}",
            message: error.full_message
          }
        end
      end
    else
      # 新規作成
      travel_detail = TravelDetail.new(travel_attrs)
      unless travel_detail.save
        travel_detail.errors.each do |error|
          @errors << {
            field: "plan_details[#{detail_index}].travel_details[#{travel_index}].#{error.attribute}",
            message: error.full_message
          }
        end
      end
    end
  end

  def process_images!
    # 画像処理は後で実装
    # 現在はimage_urlをそのまま使用
  end

  def validate_all!
    return unless @play_plan&.persisted?

    # ステップ番号の重複チェック
    step_numbers = @play_plan.plan_details.pluck(:step_number)
    duplicates = step_numbers.select { |n| step_numbers.count(n) > 1 }.uniq
    if duplicates.any?
      @errors << {
        field: "plan_details.step_number",
        message: "ステップ番号が重複しています: #{duplicates.join(', ')}"
      }
    end

    # ステップ間の時間整合性チェック
    validate_step_sequence!

    # 総予算の自動計算（total_budgetが指定されていない場合）
    unless @params[:total_budget].present?
      total_budget = @play_plan.plan_details.sum(:budget)
      @play_plan.update_column(:total_budget, total_budget) if total_budget > 0
    end
  end

  def validate_step_sequence!
    return unless @play_plan&.persisted?

    sorted_details = @play_plan.plan_details.includes(:travel_details).order(:step_number)

    # 詳細が2つ未満の場合は検証をスキップ
    return if sorted_details.count < 2

    sorted_details.each_cons(2) do |prev_detail, next_detail|
      if next_detail.start_datetime && prev_detail.end_datetime
        if next_detail.start_datetime < prev_detail.end_datetime
          @errors << {
            field: "plan_details[#{next_detail.step_number}].start_datetime",
            message: "開始時間は前のステップの終了時間より後である必要があります"
          }
        end
      end
    end
  end

  def build_response
    if success?
      # 更新後に再取得
      reloaded_play_plan = PlayPlan
        .includes(
          :recommended_fors,
          plan_details: [:spot, :travel_details]
        )
        .find(@play_plan.id)

      {
        play_plan: reloaded_play_plan,
        errors: [],
        success: true
      }
    else
      {
        play_plan: nil,
        errors: @errors,
        success: false
      }
    end
  end
end
