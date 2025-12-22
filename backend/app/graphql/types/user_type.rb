# frozen_string_literal: true

module Types
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :username, String, null: false
    field :profile_image_url, String
    field :bio, String
    field :role, String
    field :email, String, null: false
    field :password_hash, String
    field :instagram_url, String
    field :is_paid_member, Boolean
    field :paid_start_date, GraphQL::Types::ISO8601Date
    field :paid_end_date, GraphQL::Types::ISO8601Date
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    # ActiveStorageのアバター画像URL
    field :avatar_url, String, null: true
    def avatar_url
      return nil unless object.avatar.attached?

      convert_storage_url(object.avatar.url)
    end


    # ユーザーのお気に入りプラン一覧を取得
    field :favorites, [Types::FavoriteType], null: true
    def favorites
      object.favorites.latest
    end

    # ユーザーのお気に入りプラン一覧を取得（プランオブジェクトの配列）
    field :favorite_play_plans, [Types::PlayPlanType], null: true
    def favorite_play_plans
      object.favorite_play_plans
    end
  end
end
