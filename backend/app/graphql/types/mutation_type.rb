# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    # ユーザー認証関連
    field :user_register, mutation: Mutations::UserRegister
    field :user_login, mutation: Mutations::UserLogin
    field :user_logout, mutation: Mutations::UserLogout
    field :user_google_auth, mutation: Mutations::UserGoogleAuth
    field :user_apple_auth, mutation: Mutations::UserAppleAuth

    # プラン関連
    field :create_play_plan, mutation: Mutations::CreatePlayPlan
    field :update_play_plan, mutation: Mutations::UpdatePlayPlan
  end
end
