# frozen_string_literal: true
module Mutations
    class UpdateMenu < BaseMutation
        argument :id, ID, required: true
        argument :menu_name, String, required: false
        argument :price, Float, required: false
        argument :description, String, required: false
        argument :menu_category_id, ID, required: false
        argument :image, String, required: false, description: "Base64エンコードされた画像データ"
        argument :delete_image, Boolean, required: false, description: "既存の画像を削除するかどうか"

        field :menu, Types::MenuType, null: true
        field :errors, [String], null: false

        def resolve(id:, menu_name: nil, price: nil, description: nil, menu_category_id: nil, image: nil, delete_image: false)
        # 管理者権限チェック
        # unless context[:current_user]&.admin?
        #   return { menu: nil, errors: ["管理者権限が必要です"] }
        # end

        menu = Menu.find_by(id: id)
        return { menu: nil, errors: ["メニューが見つかりません"] } unless menu

        # 基本情報の更新
        menu.menu_name = menu_name if menu_name.present?
        menu.price = price if price.present?
        menu.description = description if description.present?
        menu.menu_category_id = menu_category_id if menu_category_id.present?

        begin
            if menu.save
              # 既存画像の削除
              if delete_image
                begin
                  ImageUploadService.delete_single_image(menu)
                rescue => e
                  return { menu: nil, errors: ["画像削除エラー: #{e.message}"] }
                end
              end

              # 新しい画像の添付
              if image.present?
                begin
                  # 既存の画像がある場合は削除してから新しい画像を添付
                  ImageUploadService.delete_single_image(menu) if menu.image.attached?
                  ImageUploadService.attach_base64_images(menu, [image], prefix: 'menu')
                rescue => e
                  return { menu: nil, errors: ["画像添付エラー: #{e.message}"] }
                end
              end

              { menu: menu.reload, errors: [] }
            else
              { menu: nil, errors: menu.errors.full_messages }
            end

          rescue ActiveRecord::RecordNotFound
            { menu: nil, errors: ["メニューが見つかりません"] }
          rescue => e
            { menu: nil, errors: ["システムエラー: #{e.message}"] }
          end
        end
    end
end
