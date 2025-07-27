# app/graphql/mutations/create_area.rb
# frozen_string_literal: true

module Mutations
  class CreateMenu < BaseMutation
    argument :menu_name, String, required: true
    argument :price, Float, required: false
    argument :description, String, required: false
    argument :menu_category_id, ID, required: false
    argument :image_filename, String, required: false, description: "メニューの画像ファイル名"

    field :menu,   Types::MenuType, null: true
    field :errors, [String],        null: false

    def resolve(menu_name:, price: nil, description: nil, menu_category_id: nil)
      # 管理者権限チェック
      # unless context[:current_user]&.admin?
      #   return { area: nil, errors: ["管理者権限が必要です"] }
      # end

      menu = Menu.new(
        menu_name: menu_name,
        price: price,
        description: description,
        menu_category_id: menu_category_id,
        image_filename: image_filename
      )

      if menu.save
        { menu: menu, errors: [] }
      else
        { menu: nil, errors: menu.errors.full_messages }
      end
    end
  end
end
