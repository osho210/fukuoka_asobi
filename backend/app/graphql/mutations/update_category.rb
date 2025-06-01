# app/graphql/mutations/update_category.rb
# frozen_string_literal: true

module Mutations
  class UpdateCategory < BaseMutation
    # ----------- 修正 -----------
    argument :id,   ID,     required: true
    argument :name, String, required: false
    # ----------------------------

    field :category, Types::CategoryType, null: true
    field :errors,   [String],            null: false

    def resolve(id:, name: nil)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { category: nil, errors: ["管理者権限が必要です"] }
      end

      category = Category.find_by(id: id)
      return { category: nil, errors: ["指定されたカテゴリーが見つかりません"] } unless category

      attrs = {}
      attrs[:name] = name if name.present?

      if category.update(attrs)
        { category: category, errors: [] }
      else
        { category: nil, errors: category.errors.full_messages }
      end
    end
  end
end
