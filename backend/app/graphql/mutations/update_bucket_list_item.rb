# frozen_string_literal: true

module Mutations
  class UpdateBucketListItem < BaseMutation
    argument :id, ID, required: true
    argument :layout_bucket_id, [ID], required: true
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

      # layout_bucket_id が配列の場合、最初の要素を取得
      if update_params[:layout_bucket_id].is_a?(Array) && update_params[:layout_bucket_id].present?
        update_params[:layout_bucket_id] = update_params[:layout_bucket_id].first
      end

      if bucket_list_item.update(update_params)
        { bucket_list_item: bucket_list_item, errors: [] }
      else
        { bucket_list_item: nil, errors: bucket_list_item.errors.full_messages }
      end
    end
  end
end
