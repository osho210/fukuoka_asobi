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
        # JTIを更新してトークンを無効化
        current_user.update(jti: SecureRandom.uuid)

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
