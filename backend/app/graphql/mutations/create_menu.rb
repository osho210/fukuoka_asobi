# app/graphql/mutations/create_area.rb
# frozen_string_literal: true

module Mutations
  class CreateMenu < BaseMutation
    argument :menu_name, String, required: true

    field :menu,   Types::MenuType, null: true
    field :errors, [String],        null: false

    def resolve(menu_name:)
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { area: nil, errors: ["管理者権限が必要です"] }
      # end

      menu = Menu.new(menu_name: menu_name)

      if menu.save
        { menu: menu, errors: [] }
      else
        { menu: nil, errors: menu.errors.full_messages }
      end
    end
  end
end
