# app/graphql/mutations/create_recommended_for.rb
# frozen_string_literal: true

module Mutations
  class CreateRecommendedFor < BaseMutation
    # ------- 変更点 -------
    argument :name, String, required: true
    # ----------------------

    field :recommended_for, Types::RecommendedForType, null: true
    field :errors,          [String],                  null: false

    def resolve(name:)
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { recommended_for: nil, errors: ["管理者権限が必要です"] }
      # end

      recommended_for = RecommendedFor.new(name: name)

      if recommended_for.save
        { recommended_for: recommended_for, errors: [] }
      else
        { recommended_for: nil, errors: recommended_for.errors.full_messages }
      end
    end
  end
end
