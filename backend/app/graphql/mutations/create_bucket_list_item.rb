# frozen_string_literal: true

module Mutations
  class CreateBucketListItem < BaseMutation
    argument :input, Types::Input::CreateBucketListItemInputType, required: true

    field :bucket_list_item, Types::BucketListItemType, null: true
    field :errors, [ String ], null: false

    def resolve(input:)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { bucket_list_item: nil, errors: [ "管理者権限が必要です" ] }
      end

      bucket_list_item = BucketListItem.new(input.to_h)

      if bucket_list_item.save
        { bucket_list_item: bucket_list_item, errors: [] }
      else
        { bucket_list_item: nil, errors: bucket_list_item.errors.full_messages }
      end
    end
  end
end
