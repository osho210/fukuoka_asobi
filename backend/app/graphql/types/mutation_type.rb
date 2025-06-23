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
    field :generate_plan, mutation: Mutations::GeneratePlan

    # ユーザープロフィール関連
    field :update_user_profile, mutation: Mutations::UpdateUserProfile

    # ブックマーク関連
    field :create_bookmark, mutation: Mutations::CreateBookmark
    field :update_bookmark, mutation: Mutations::UpdateBookmark
    field :delete_bookmark, mutation: Mutations::DeleteBookmark

    # お気に入り関連
    field :add_favorite, mutation: Mutations::AddFavorite
    field :remove_favorite, mutation: Mutations::RemoveFavorite

    # エリア関連
    field :create_area, mutation: Mutations::CreateArea
    field :update_area, mutation: Mutations::UpdateArea
    field :delete_area, mutation: Mutations::DeleteArea

    # メニュー関連
    field :create_menu, mutation: Mutations::CreateMenu
    field :update_menu, mutation: Mutations::UpdateMenu
    field :delete_menu, mutation: Mutations::DeleteMenu

    # イベント関連
    field :create_event, mutation: Mutations::CreateEvent
    field :update_event, mutation: Mutations::UpdateEvent
    # field :delete_event, mutation: Mutations::DeleteEvent

    # カテゴリー関連
    field :create_category, mutation: Mutations::CreateCategory
    field :update_category, mutation: Mutations::UpdateCategory
    field :delete_category, mutation: Mutations::DeleteCategory

    # 地区関連
    field :create_district, mutation: Mutations::CreateDistrict
    field :update_district, mutation: Mutations::UpdateDistrict
    field :delete_district, mutation: Mutations::DeleteDistrict

    # ハッシュタグ関連
    field :create_hashtag, mutation: Mutations::CreateHashtag
    field :update_hashtag, mutation: Mutations::UpdateHashtag
    field :delete_hashtag, mutation: Mutations::DeleteHashtag

    # 目的関連
    field :create_purpose, mutation: Mutations::CreatePurpose
    field :update_purpose, mutation: Mutations::UpdatePurpose
    field :delete_purpose, mutation: Mutations::DeletePurpose

    # news関連
    field :create_news, mutation: Mutations::CreateNews
    field :update_news, mutation: Mutations::UpdateNews
    # field :delete_news, mutation: Mutations::DeleteNews

    # 雰囲気関連
    field :create_spot_ambiance, mutation: Mutations::CreateSpotAmbiance
    field :update_spot_ambiance, mutation: Mutations::UpdateSpotAmbiance
    field :delete_spot_ambiance, mutation: Mutations::DeleteSpotAmbiance

    # spot関連
    field :create_spot, mutation: Mutations::CreateSpot
    field :update_spot, mutation: Mutations::UpdateSpot
    field :delete_spot, mutation: Mutations::DeleteSpot

    # 駅関連
    field :create_station, mutation: Mutations::CreateStation
    field :update_station, mutation: Mutations::UpdateStation
    field :delete_station, mutation: Mutations::DeleteStation

    # おすすめ対象関連
    field :create_recommended_for, mutation: Mutations::CreateRecommendedFor
    field :update_recommended_for, mutation: Mutations::UpdateRecommendedFor
    field :delete_recommended_for, mutation: Mutations::DeleteRecommendedFor
  end
end
