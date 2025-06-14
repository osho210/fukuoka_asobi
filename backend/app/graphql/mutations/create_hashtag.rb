# app/graphql/mutations/create_hashtag.rb
# frozen_string_literal: true

module Mutations
  class CreateHashtag < BaseMutation
    # ---------- 修正 ----------
    argument :hashtag_name, String, required: true
    # --------------------------

    field :hashtag, Types::HashtagType, null: true
    field :errors,  [String],           null: false

    def resolve(hashtag_name:)
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { hashtag: nil, errors: ["管理者権限が必要です"] }
      # end

      hashtag = Hashtag.new(hashtag_name: hashtag_name)

      if hashtag.save
        { hashtag: hashtag, errors: [] }
      else
        { hashtag: nil, errors: hashtag.errors.full_messages }
      end
    end
  end
end
