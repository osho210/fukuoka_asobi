require 'base64'
require 'stringio'

class UpdatePlayPlanWithDetailsService
  attr_reader :play_plan, :errors

  def initialize(params, current_user = nil)
    @params = params.to_h.with_indifferent_access
    @current_user = current_user
    @play_plan = nil
    @errors = []
  end

  def execute
    ActiveRecord::Base.transaction do
      # 1. PlayPlan の取得と更新
      find_and_update_play_plan!

      # 2. PlanDetail の削除処理
      delete_plan_details!

      # 3. PlanDetail の作成・更新処理
      process_plan_details!

      # 4. バリデーション
      validate_all!

      raise ActiveRecord::Rollback if @errors.any?
    end

    build_response
  end

  def success?
    @errors.empty?
  end

  private

  def find_and_update_play_plan!
    @play_plan = PlayPlan.find_by(id: @params[:id])
    unless @play_plan
      @errors << { field: "id", message: "指定されたプランが見つかりません" }
      return
    end

    # PlayPlan の更新（指定されたフィールドのみ）
    plan_attrs = @params.except(
      :id,
      :plan_details,
      :deleted_plan_detail_ids,
      :recommend_users,
      :images,
      :delete_image_ids
    ).compact

    if plan_attrs.any?
      unless @play_plan.update(plan_attrs)
        @play_plan.errors.each do |error|
          @errors << { field: error.attribute.to_s, message: error.full_message }
        end
      end
    end

    # 画像処理
    process_images!

    # おすすめ対象の関連付け
    process_recommended_fors! if @params[:recommend_users].present?
  end

  def process_images!
    # 画像削除処理
    if @params[:delete_image_ids].present?
      @params[:delete_image_ids].each do |image_id|
        begin
          image = @play_plan.images.find_by(id: image_id)
          if image
            image.purge
            Rails.logger.info "Deleted image ID: #{image_id}"
          else
            @errors << {
              field: "delete_image_ids",
              message: "ID #{image_id} の画像が見つかりません"
            }
          end
        rescue => e
          Rails.logger.error "Error deleting image #{image_id}: #{e.message}"
          @errors << {
            field: "delete_image_ids",
            message: "画像の削除中にエラーが発生しました"
          }
        end
      end
    end

    # 新しい画像の追加
    if @params[:images].present?
      @params[:images].each_with_index do |base64_image, index|
        begin
          # Base64画像をデコードしてActiveStorageに保存
          if base64_image.include?(',')
            decoded_image = Base64.decode64(base64_image.split(',').last)
          else
            decoded_image = Base64.decode64(base64_image)
          end

          @play_plan.images.attach(
            io: StringIO.new(decoded_image),
            filename: "play_plan_#{@play_plan.id}_#{Time.current.to_i}_#{index}.jpg",
            content_type: 'image/jpeg'
          )
          Rails.logger.info "Attached new image for play_plan #{@play_plan.id}"
        rescue => e
          Rails.logger.error "Error attaching image #{index}: #{e.message}"
          @errors << {
            field: "images",
            message: "画像 #{index + 1} のアップロード中にエラーが発生しました"
          }
        end
      end
    end
  end

  def process_recommended_fors!
    @play_plan.play_plan_recommended_fors.destroy_all
    @params[:recommend_users].each do |recommended_for_id|
      recommended_for = RecommendedFor.find_by(id: recommended_for_id)
      if recommended_for
        @play_plan.recommended_fors << recommended_for
      else
        @errors << {
          field: "recommend_users",
          message: "ID #{recommended_for_id} のおすすめ対象が見つかりません"
        }
      end
    end
  end

  def delete_plan_details!
    return unless @params[:deleted_plan_detail_ids].present?

    deleted_ids = @params[:deleted_plan_detail_ids].map(&:to_i)

    # 削除対象のPlanDetailが実際に存在し、このプランに属しているかチェック
    existing_details = @play_plan.plan_details.where(id: deleted_ids)
    found_ids = existing_details.pluck(:id)

    # 存在しないIDがある場合はエラー
    missing_ids = deleted_ids - found_ids
    if missing_ids.any?
      @errors << {
        field: "deleted_plan_detail_ids",
        message: "削除対象のプラン詳細が見つかりません: #{missing_ids.join(', ')}"
      }
      return
    end

    # 削除実行（関連するTravelDetailも自動削除される）
    existing_details.destroy_all

    Rails.logger.info "Deleted PlanDetails: #{found_ids.join(', ')}"
  end

  def process_plan_details!
    return unless @params[:plan_details].present?

    @params[:plan_details].each_with_index do |detail_params, index|
      process_single_plan_detail!(detail_params, index)
    end
  end

  def process_single_plan_detail!(detail_params, index)
    # GraphQL入力オブジェクトをハッシュに変換
    detail_hash = detail_params.to_h.with_indifferent_access
    detail_attrs = detail_hash.except(:id, :travel_details)
    detail_attrs[:plan_id] = @play_plan.id

    # 基本バリデーション
    validate_plan_detail_attrs!(detail_attrs, index)
    return if @errors.any? { |e| e[:field].include?("plan_details[#{index}]") }

    plan_detail = nil

    if detail_params[:id].present?
      # 更新処理
      plan_detail = update_plan_detail!(detail_params[:id], detail_attrs, index)
    else
      # 新規作成処理
      plan_detail = create_plan_detail!(detail_attrs, index)
    end

    # TravelDetail の処理
    if plan_detail&.persisted? && detail_params[:travel_details].present?
      process_travel_details_for_plan_detail!(
        plan_detail.id,
        detail_params[:travel_details],
        index
      )
    end
  end

  def validate_plan_detail_attrs!(detail_attrs, index)
    # 必須フィールドチェック
    if detail_attrs[:step_number].blank?
      @errors << {
        field: "plan_details[#{index}].step_number",
        message: "ステップ番号は必須です"
      }
    end

    if detail_attrs[:step_name].blank?
      @errors << {
        field: "plan_details[#{index}].step_name",
        message: "ステップ名は必須です"
      }
    end

    # 日時バリデーション
    if detail_attrs[:start_datetime] && detail_attrs[:end_datetime]
      if detail_attrs[:start_datetime] >= detail_attrs[:end_datetime]
        @errors << {
          field: "plan_details[#{index}].start_datetime",
          message: "開始時間は終了時間より前である必要があります"
        }
      end
    end

    # スポット存在チェック
    if detail_attrs[:spot_id].present?
      unless Spot.exists?(id: detail_attrs[:spot_id])
        @errors << {
          field: "plan_details[#{index}].spot_id",
          message: "指定されたスポットが見つかりません"
        }
      end
    end
  end

  def update_plan_detail!(detail_id, detail_attrs, index)
    plan_detail = @play_plan.plan_details.find_by(id: detail_id)
    unless plan_detail
      @errors << {
        field: "plan_details[#{index}].id",
        message: "指定されたプラン詳細が見つかりません"
      }
      return nil
    end

    unless plan_detail.update(detail_attrs)
      plan_detail.errors.each do |error|
        @errors << {
          field: "plan_details[#{index}].#{error.attribute}",
          message: error.full_message
        }
      end
      return nil
    end

    Rails.logger.info "Updated PlanDetail ID: #{plan_detail.id}"
    plan_detail
  end

  def create_plan_detail!(detail_attrs, index)
    plan_detail = PlanDetail.new(detail_attrs)
    unless plan_detail.save
      plan_detail.errors.each do |error|
        @errors << {
          field: "plan_details[#{index}].#{error.attribute}",
          message: error.full_message
        }
      end
      return nil
    end

    Rails.logger.info "Created PlanDetail ID: #{plan_detail.id}"
    plan_detail
  end

  def process_travel_details_for_plan_detail!(plan_detail_id, travel_details_params, detail_index)
    existing_travel_ids = TravelDetail.where(plan_detail_id: plan_detail_id).pluck(:id)
    input_travel_ids = travel_details_params.filter_map { |travel| travel[:id]&.to_i }

    # 削除対象のTravelDetailを削除
    travels_to_delete = existing_travel_ids - input_travel_ids
    if travels_to_delete.any?
      TravelDetail.where(id: travels_to_delete).destroy_all
      Rails.logger.info "Deleted TravelDetails: #{travels_to_delete.join(', ')}"
    end

    # 各TravelDetailを処理
    travel_details_params.each_with_index do |travel_params, travel_index|
      process_single_travel_detail!(travel_params, plan_detail_id, detail_index, travel_index)
    end
  end

  def process_single_travel_detail!(travel_params, plan_detail_id, detail_index, travel_index)
    # GraphQL入力オブジェクトをハッシュに変換
    travel_hash = travel_params.to_h.with_indifferent_access
    travel_attrs = travel_hash.except(:id)
    travel_attrs[:plan_detail_id] = plan_detail_id

    # 移動方法バリデーション
    valid_methods = %w[徒歩 電車 車 自転車 その他]
    if travel_attrs[:travel_method].present? && !valid_methods.include?(travel_attrs[:travel_method])
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
      else
        Rails.logger.info "Updated TravelDetail ID: #{travel_detail.id}"
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
      else
        Rails.logger.info "Created TravelDetail ID: #{travel_detail.id}"
      end
    end
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
      if total_budget > 0
        @play_plan.update_column(:total_budget, total_budget)
        Rails.logger.info "Auto-calculated total_budget: #{total_budget}"
      end
    end
  end

  def validate_step_sequence!
    sorted_details = @play_plan.plan_details.includes(:travel_details).order(:step_number)

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
        .with_attached_images
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
