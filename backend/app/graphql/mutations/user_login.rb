# frozen_string_literal: true

module Mutations
  class UserLogin < BaseMutation
    description "パスワード認証は廃止されました。Googleログインをご利用ください。"

    # 入力フィールド
    argument :email, String, required: true
    argument :password, String, required: true

    # 出力フィールド
    field :user, Types::UserType, null: true
    field :token, String, null: true
    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(email:, password:)
      # パスワード認証は廃止されました
      {
        user: nil,
        token: nil,
        success: false,
        errors: ["パスワード認証は廃止されました。Googleアカウントでログインしてください。"]
      }
    end
  end
end
