# app/graphql/mutations/update_recommended_for.rb
# frozen_string_literal: true

module Mutations
  class UpdateRecommendedFor < BaseMutation
    # ---------- 変更点 ----------
    argument :id,   ID,     required: true
    argument :name, String, required: false
    # ----------------------------

    field :recommended_for, Types::RecommendedForType, null: true
    field :errors,          [String],                  null: false

    def resolve(id:, name: nil)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { recommended_for: nil, errors: ["管理者権限が必要です"] }
      end

      recommended_for = RecommendedFor.find_by(id: id)
      return { recommended_for: nil, errors: ["指定されたおすすめ対象が見つかりません"] } unless recommended_for

      attrs = {}
      attrs[:name] = name if name.present?

      if recommended_for.update(attrs)
        { recommended_for: recommended_for, errors: [] }
      else
        { recommended_for: nil, errors: recommended_for.errors.full_messages }
      end
    end
  end
end
