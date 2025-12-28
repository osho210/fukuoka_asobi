# frozen_string_literal: true

module Mutations
  class UpdateLayoutBucket < BaseMutation
    argument :id, ID, required: true
    argument :input, Types::Input::UpdateLayoutBucketInputType, required: true

    field :layout_bucket, Types::LayoutBucketType, null: true
    field :errors, [ String ], null: false

    def resolve(id:, input:)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { layout_bucket: nil, errors: [ "管理者権限が必要です" ] }
      end

      layout_bucket = LayoutBucket.find_by(id: id)
      return { layout_bucket: nil, errors: [ "レイアウトバケットが見つかりません" ] } unless layout_bucket

      if layout_bucket.update(input.to_h)
        { layout_bucket: layout_bucket, errors: [] }
      else
        { layout_bucket: nil, errors: layout_bucket.errors.full_messages }
      end
    end
  end
end
