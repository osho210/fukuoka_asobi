# frozen_string_literal: true
module Mutations
    class UpdateMenu < BaseMutation
        argument :id, ID, required: true
        argument :menu_name, String, required: true

        field :menu, Types::MenuType, null: true
        field :errors, [String], null: false

        def resolve(id:, menu_name:, price: nil, description: nil)
        # 管理者権限チェック
        # unless context[:current_user]&.admin?
        #   return { menu: nil, errors: ["管理者権限が必要です"] }
        # end

        menu = Menu.find_by(id: id)
        return { menu: nil, errors: ["メニューが見つかりません"] } unless menu

        menu.menu_name = menu_name
        menu.price = price if price
        menu.description = description if description

        if menu.save
            { menu: menu, errors: [] }
        else
            { menu: nil, errors: menu.errors.full_messages }
        end
        end
    end
end