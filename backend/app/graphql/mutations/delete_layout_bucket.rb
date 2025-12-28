# frozen_string_literal: true

module Mutations
  class DeleteLayoutBucket < BaseMutation
    argument :id, ID, required: true

    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { success: false, errors: ["管理者権限が必要です"] }
      end

      layout_bucket = LayoutBucket.find_by(id: id)
      return { success: false, errors: ["指定されたレイアウトバケットが見つかりません"] } unless layout_bucket

      if layout_bucket.bucket_list_items.exists?
        return { success: false, errors: ["このレイアウトバケットに関連付けられた企画が存在するため削除できません"] }
      end

      if layout_bucket.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: layout_bucket.errors.full_messages }
      end
    end
  end
end
