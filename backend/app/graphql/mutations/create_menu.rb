# frozen_string_literal: true

module Mutations
  class CreateMenu < BaseMutation
    argument :menu_name, String, required: true
    argument :price, Float, required: false
    argument :description, String, required: false
    argument :menu_category_id, ID, required: false
    argument :image, String, required: false, description: "Base64エンコードされた画像データ"

    field :menu,   Types::MenuType, null: true
    field :errors, [String],        null: false

    def resolve(menu_name:, price: nil, description: nil, menu_category_id: nil, image: nil)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { menu: nil, errors: ["管理者権限が必要です"] }
        end

      menu = Menu.new(
        menu_name: menu_name,
        price: price,
        description: description,
        menu_category_id: menu_category_id
      )

      if menu.save
        # 画像がある場合は添付
        if image.present?
          ImageUploadService.attach_base64_images(menu, [image], prefix: 'menu')
        end

        { menu: menu.reload, errors: [] }
      else
        { menu: nil, errors: menu.errors.full_messages }
      end
    rescue => e
      { menu: nil, errors: [e.message] }
    end
  end
end
