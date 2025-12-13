# app/graphql/mutations/update_hashtag.rb
# frozen_string_literal: true

module Mutations
  class UpdateHashtag < BaseMutation
    # ---------- 変更 ----------
    argument :id,           ID,     required: true
    argument :hashtag_name, String, required: false
    # --------------------------

    field :hashtag, Types::HashtagType, null: true
    field :errors,  [String],           null: false

    def resolve(id:, hashtag_name: nil)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { hashtag: nil, errors: ["管理者権限が必要です"] }
      end

      hashtag = Hashtag.find_by(id: id)
      return { hashtag: nil, errors: ["指定されたハッシュタグが見つかりません"] } unless hashtag

      attrs = {}
      attrs[:hashtag_name] = hashtag_name if hashtag_name.present?

      if hashtag.update(attrs)
        { hashtag: hashtag, errors: [] }
      else
        { hashtag: nil, errors: hashtag.errors.full_messages }
      end
    end
  end
end
