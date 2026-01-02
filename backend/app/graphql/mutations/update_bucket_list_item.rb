# frozen_string_literal: true

module Mutations
  class UpdateBucketListItem < BaseMutation
    argument :id, ID, required: true
    argument :top_display_flag, Boolean, required: true
    argument :layout_bucket_ids, [ID], required: true
    argument :title, String, required: true
    argument :content, String, required: false
    argument :area_text, String, required: false
    argument :meeting_place_name, String, required: false
    argument :meeting_place_address, String, required: false
    argument :meeting_place_google_place_id, String, required: false
    argument :stay_minutes, Integer, required: false
    argument :meeting_time, GraphQL::Types::ISO8601DateTime, required: false
    argument :start_time, GraphQL::Types::ISO8601DateTime, required: false
    argument :end_time, GraphQL::Types::ISO8601DateTime, required: false
    argument :cost_min, Integer, required: false
    argument :cost_max, Integer, required: false
    argument :weather, Types::WeatherEnumType, required: false
    argument :status, Types::BucketListItemStatusEnumType, required: false
    argument :published_at, GraphQL::Types::ISO8601DateTime, required: false
    argument :bucket_list_item_belongings_attributes, [Types::BucketListItemBelongingInputType], required: false
    argument :bucket_list_item_references_attributes, [Types::BucketListItemReferenceInputType], required: false

    field :bucket_list_item, Types::BucketListItemType, null: true
    field :errors, [ String ], null: false

    def resolve(**args)
      id = args.delete(:id)

      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { bucket_list_item: nil, errors: [ "管理者権限が必要です" ] }
      end

      bucket_list_item = BucketListItem.find_by(id: id)
      return { bucket_list_item: nil, errors: [ "バケットリスト企画が見つかりません" ] } unless bucket_list_item

      # null 値を除外して更新
      update_params = args.compact

      # layout_bucket_ids が配列の場合、最初の要素を取得して layout_bucket_id に変換
      if update_params[:layout_bucket_ids].present?
        layout_bucket_id = if update_params[:layout_bucket_ids].is_a?(Array)
          update_params[:layout_bucket_ids].first
        else
          update_params[:layout_bucket_ids]
        end
        update_params.delete(:layout_bucket_ids)
        update_params[:layout_bucket_id] = layout_bucket_id
      end

      # 持ち物と参考資料の属性を抽出して別途処理
      belongings_attributes = update_params.delete(:bucket_list_item_belongings_attributes)
      references_attributes = update_params.delete(:bucket_list_item_references_attributes)

      if bucket_list_item.update(update_params)
        # 持ち物の更新
        if belongings_attributes.present?
          belongings_attributes.each do |attr|
            if attr[:id].present?
              # 既存の持ち物を更新または削除
              belonging = bucket_list_item.bucket_list_item_belongings.find_by(id: attr[:id])
              if attr[:_destroy]
                belonging.destroy if belonging
              else
                belonging.update(attr.except(:_destroy))
              end
            else
              # 新規持ち物を作成
              bucket_list_item.bucket_list_item_belongings.create(attr.except(:_destroy))
            end
          end
        end

        # 参考資料の更新
        if references_attributes.present?
          references_attributes.each do |attr|
            if attr[:id].present?
              # 既存の参考資料を更新または削除
              reference = bucket_list_item.bucket_list_item_references.find_by(id: attr[:id])
              if attr[:_destroy]
                reference.destroy if reference
              else
                reference.update(attr.except(:_destroy))
              end
            else
              # 新規参考資料を作成
              bucket_list_item.bucket_list_item_references.create(attr.except(:_destroy))
            end
          end
        end

        { bucket_list_item: bucket_list_item, errors: [] }
      else
        { bucket_list_item: nil, errors: bucket_list_item.errors.full_messages }
      end
    end
  end
end
