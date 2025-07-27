# frozen_string_literal: true
module Mutations
    class UpdateMenu < BaseMutation
        argument :id, ID, required: true
        argument :menu_name, String, required: false
        argument :price, Float, required: false
        argument :description, String, required: false
        argument :menu_category_id, ID, required: false
        argument :image_filename, String, required: false

        field :menu, Types::MenuType, null: true
        field :errors, [String], null: false

        def resolve(id:, menu_name: nil, price: nil, description: nil, menu_category_id: nil, image_filename: nil)
        # 管理者権限チェック
        # unless context[:current_user]&.admin?
        #   return { menu: nil, errors: ["管理者権限が必要です"] }
        # end

        menu = Menu.find_by(id: id)
        return { menu: nil, errors: ["メニューが見つかりません"] } unless menu

        menu.menu_name = menu_name if menu_name.present?
        menu.price = price if price.present?
        menu.description = description if description.present?
        menu.menu_category_id = menu_category_id if menu_category_id.present?
        menu.image_filename = image_filename if image_filename.present?

        if menu.save
            { menu: menu, errors: [] }
        else
            { menu: nil, errors: menu.errors.full_messages }
        end
        end
    end
end
