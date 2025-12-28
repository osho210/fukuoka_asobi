# frozen_string_literal: true

module Mutations
  class CreateLayoutBucket < BaseMutation
    argument :input, Types::Input::CreateLayoutBucketInputType, required: true

    field :layout_bucket, Types::LayoutBucketType, null: true
    field :errors, [String], null: false

    def resolve(input:)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { layout_bucket: nil, errors: ["管理者権限が必要です"] }
      end

      layout_bucket = LayoutBucket.new(input.to_h)

      if layout_bucket.save
        { layout_bucket: layout_bucket, errors: [] }
      else
        { layout_bucket: nil, errors: layout_bucket.errors.full_messages }
      end
    end
  end
end
