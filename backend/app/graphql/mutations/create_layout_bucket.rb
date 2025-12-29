# frozen_string_literal: true

module Mutations
  class CreateLayoutBucket < BaseMutation
    argument :key, String, required: true
    argument :name, String, required: true
    argument :template_key, String, required: true
    argument :theme_key, String, required: false
    argument :shift, Types::LayoutBucketShiftEnumType, required: false
    argument :tilt, Types::TiltEnumType, required: false
    argument :depth, Types::DepthEnumType, required: false
    argument :status, Types::LayoutBucketStatusEnumType, required: false
    argument :sort_order, Integer, required: false

    field :layout_bucket, Types::LayoutBucketType, null: true
    field :errors, [ String ], null: false

    def resolve(**args)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { layout_bucket: nil, errors: [ "管理者権限が必要です" ] }
      end

      layout_bucket = LayoutBucket.new(args)

      if layout_bucket.save
        { layout_bucket: layout_bucket, errors: [] }
      else
        { layout_bucket: nil, errors: layout_bucket.errors.full_messages }
      end
    end
  end
end
