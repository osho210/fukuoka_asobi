# frozen_string_literal: true

module Mutations
  class UpdateBucketListItem < BaseMutation
    argument :id, ID, required: true
    argument :input, Types::Input::UpdateBucketListItemInputType, required: true

    field :bucket_list_item, Types::BucketListItemType, null: true
    field :errors, [ String ], null: false

    def resolve(id:, input:)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { bucket_list_item: nil, errors: [ "管理者権限が必要です" ] }
      end

      bucket_list_item = BucketListItem.find_by(id: id)
      return { bucket_list_item: nil, errors: [ "バケットリスト企画が見つかりません" ] } unless bucket_list_item

      if bucket_list_item.update(input.to_h)
        { bucket_list_item: bucket_list_item, errors: [] }
      else
        { bucket_list_item: nil, errors: bucket_list_item.errors.full_messages }
      end
    end
  end
end
