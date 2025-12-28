# frozen_string_literal: true

module Mutations
  class DeleteBucketListItem < BaseMutation
    argument :id, ID, required: true

    field :success, Boolean, null: false
    field :errors, [ String ], null: false

    def resolve(id:)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { success: false, errors: [ "管理者権限が必要です" ] }
      end

      bucket_list_item = BucketListItem.find_by(id: id)
      return { success: false, errors: [ "指定されたバケットリスト企画が見つかりません" ] } unless bucket_list_item

      if bucket_list_item.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: bucket_list_item.errors.full_messages }
      end
    end
  end
end
