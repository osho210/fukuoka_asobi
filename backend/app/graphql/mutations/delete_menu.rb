# frozen_string_literal: true

module Mutations
    class DeleteMenu < BaseMutation
        argument :id, ID, required: true

        field :menu, Types::MenuType, null: true
        field :errors, [String], null: false


        def resolve(id:)
        # 管理者権限チェック
        unless context[:current_user]&.admin?
          return { menu: nil, errors: ["管理者権限が必要です"] }
          end
            menu = Menu.find_by(id: id)
            return { menu: nil, errors: ["メニューが見つかりません"] } unless menu

            if menu.destroy
                { menu: menu, errors: [] }
            else
                { menu: nil, errors: menu.errors.full_messages }
            end
        end
    end
end
