# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::UpdateUserProfile, type: :request do
  describe 'ユーザープロフィール更新' do
    let(:user) { create(:user) }
    let(:context) { { current_user: user } }

    let(:query) do
      <<~GQL
        mutation UpdateUserProfile(
          $username: String,
          $instagramUrl: String,
          $bio: String,
          $profileImageUrl: String,
          $avatar: String
        ) {
          updateUserProfile(
            username: $username,
            instagramUrl: $instagramUrl,
            bio: $bio,
            profileImageUrl: $profileImageUrl,
            avatar: $avatar
          ) {
            user {
              id
              username
              instagramUrl
              bio
              profileImageUrl
              avatarUrl
            }
            errors
          }
        }
      GQL
    end

    it 'テキストフィールドを更新できること' do
      variables = {
        username: 'updated_username',
        instagramUrl: 'https://instagram.com/updated',
        bio: '更新された自己紹介文'
      }

      result = BackendSchema.execute(
        query,
        variables: variables,
        context: context
      ).to_h

      # エラーがないことを確認
      expect(result.dig('data', 'updateUserProfile', 'errors')).to be_empty

      # 更新されたユーザー情報を確認
      updated_user = result.dig('data', 'updateUserProfile', 'user')
      expect(updated_user['username']).to eq('updated_username')
      expect(updated_user['instagramUrl']).to eq('https://instagram.com/updated')
      expect(updated_user['bio']).to eq('更新された自己紹介文')
    end

    it 'Base64エンコードされた画像をアップロードできること' do
      # テスト用のBase64エンコードされた画像データ（ダミーデータ）
      dummy_image_data = 'dummy image content'
      base64_image = 'data:image/jpeg;base64,' + Base64.strict_encode64(dummy_image_data)

      variables = {
        avatar: base64_image
      }

      result = BackendSchema.execute(
        query,
        variables: variables,
        context: context
      ).to_h

      # エラーがないことを確認
      expect(result.dig('data', 'updateUserProfile', 'errors')).to be_empty

      # アバターがアタッチされたことを確認
      expect(user.reload.avatar).to be_attached

      # avatarUrlが返されることを確認
      expect(result.dig('data', 'updateUserProfile', 'user', 'avatarUrl')).not_to be_nil
    end

    it '認証されていないユーザーはプロフィールを更新できないこと' do
      variables = {
        username: 'updated_username'
      }

      result = BackendSchema.execute(
        query,
        variables: variables,
        context: { current_user: nil } # 認証されていないユーザー
      ).to_h

      # エラーが返されることを確認
      expect(result.dig('data', 'updateUserProfile', 'errors')).not_to be_empty
      expect(result.dig('data', 'updateUserProfile', 'errors').first).to include('認証')

      # ユーザー情報が返されないことを確認
      expect(result.dig('data', 'updateUserProfile', 'user')).to be_nil
    end
  end
end
