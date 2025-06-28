# app/graphql/mutations/create_category.rb
# frozen_string_literal: true

module Mutations
  class CreateCategory < BaseMutation
    # ----------- 修正 -----------
    argument :name, String, required: true
    # ----------------------------

    field :category, Types::CategoryType, null: true
    field :errors,   [String],            null: false

    def resolve(name:)
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { category: nil, errors: ["管理者権限が必要です"] }
      # end
      # TODO: エラーメッセージの設計
      # すでに登録されている名称であれば、エラーを返却する
      raise GraphQL::ExecutionError, "このカテゴリーはすでに存在します" if Category.exists?(name: name)


      category = Category.new(name: name)

      if category.save
        { category: category, errors: [] }
      else
        { category: nil, errors: category.errors.full_messages }
      end
    end
  end
end
