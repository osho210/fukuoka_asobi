# frozen_string_literal: true

module Mutations
  class UpdateLayoutBucket < BaseMutation
    argument :id, ID, required: true
    argument :key, String, required: false
    argument :name, String, required: false
    argument :template_key, String, required: false
    argument :theme_key, String, required: false
    argument :shift, Types::LayoutBucketShiftEnumType, required: false
    argument :tilt, Types::TiltEnumType, required: false
    argument :depth, Types::DepthEnumType, required: false
    argument :status, Types::LayoutBucketStatusEnumType, required: false
    argument :sort_order, Integer, required: false

    field :layout_bucket, Types::LayoutBucketType, null: true
    field :errors, [ String ], null: false

    def resolve(id:, **args)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { layout_bucket: nil, errors: [ "管理者権限が必要です" ] }
      end

      layout_bucket = LayoutBucket.find_by(id: id)
      return { layout_bucket: nil, errors: [ "レイアウトバケットが見つかりません" ] } unless layout_bucket

      # id を除外したパラメータでアップデート
      update_params = args.except(:id)
      if layout_bucket.update(update_params)
        { layout_bucket: layout_bucket, errors: [] }
      else
        { layout_bucket: nil, errors: layout_bucket.errors.full_messages }
      end
    end
  end
end
