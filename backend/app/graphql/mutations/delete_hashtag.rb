# app/graphql/mutations/delete_hashtag.rb
# frozen_string_literal: true

module Mutations
  class DeleteHashtag < BaseMutation
    # ---------- 変更 ----------
    argument :id, ID, required: true
    # --------------------------

    field :success, Boolean, null: false
    field :errors,  [String], null: false

    def resolve(id:)
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { success: false, errors: ["管理者権限が必要です"] }
      # end

      hashtag = Hashtag.find_by(id: id)
      return { success: false, errors: ["指定されたハッシュタグが見つかりません"] } unless hashtag

      if hashtag.spots.exists?
        return { success: false, errors: ["このハッシュタグに関連付けられたスポットが存在するため削除できません"] }
      end

      if hashtag.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: hashtag.errors.full_messages }
      end
    end
  end
end
