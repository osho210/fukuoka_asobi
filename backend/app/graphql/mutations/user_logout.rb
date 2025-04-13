# frozen_string_literal: true

module Mutations
  class UserLogout < BaseMutation
    description "ユーザーログアウトを行います"

    # 出力フィールド
    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve
      # 現在のユーザーを取得
      current_user = context[:current_user]

      if current_user
        # Cookieを削除
        context[:controller].send(:clear_user_cookie)

        {
          success: true,
          errors: []
        }
      else
        {
          success: false,
          errors: ["ログインしていません"]
        }
      end
    end
  end
end
