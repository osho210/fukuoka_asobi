# frozen_string_literal: true

module Mutations
  class UserRegister < BaseMutation
    description "パスワード認証は廃止されました。Googleログインをご利用ください。"

    # 入力フィールド
    argument :email, String, required: true
    argument :password, String, required: true
    argument :nickname, String, required: true
    argument :gender, String, required: true
    argument :terms_agreed, Boolean, required: true

    # 出力フィールド
    field :user, Types::UserType, null: true
    field :token, String, null: true
    field :errors, [String], null: false

    def resolve(email:, password:, nickname:, gender:, terms_agreed:)
      # パスワード認証は廃止されました
      {
        user: nil,
        token: nil,
        errors: ["パスワードによる新規登録は廃止されました。Googleアカウントでログインしてください。"]
      }
    end
  end
end
