# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::CreateSpot, type: :request do
  # テスト用の1x1 pixel PNG画像データ
  # この画像は最小限の有効なPNGファイルで、ImageUploadServiceのバリデーションをテストするために使用
  def valid_png_base64
    png_data = "\x89PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1F\x15\xC4\x89\x00\x00\x00\nIDATx\x9Cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xB4\x00\x00\x00\x00IEND\xAEB`\x82".force_encoding('BINARY')
    'data:image/png;base64,' + Base64.strict_encode64(png_data)
  end

  describe 'Spot新規作成' do
    let(:admin_user) { create(:user, role: :admin) }
    let(:district) { create(:district) }
    let(:context) { { current_user: admin_user } }

    let(:query) do
      <<~GQL
        mutation CreateSpot(
          $spotName: String!,
          $address: String!,
          $districtId: ID!,
          $spotType: String!,
          $images: [String!]
        ) {
          createSpot(
            spotName: $spotName,
            address: $address,
            districtId: $districtId,
            spotType: $spotType,
            images: $images
          ) {
            spot {
              id
              spotName
              address
            }
            errors
          }
        }
      GQL
    end

    it '基本情報のみでSpotを作成できること' do
      variables = {
        spotName: 'テストスポット',
        address: '福岡県福岡市中央区天神1-1-1',
        districtId: district.id,
        spotType: 'STORE'
      }

      result = BackendSchema.execute(
        query,
        variables: variables,
        context: context
      ).to_h

      # エラーがないことを確認
      expect(result.dig('data', 'createSpot', 'errors')).to be_empty

      # Spotが作成されたことを確認
      created_spot = result.dig('data', 'createSpot', 'spot')
      expect(created_spot).not_to be_nil
      expect(created_spot['spotName']).to eq('テストスポット')
      expect(created_spot['address']).to eq('福岡県福岡市中央区天神1-1-1')
    end

    it 'Base64エンコードされた画像を含めてSpotを作成できること' do
      base64_image = valid_png_base64

      variables = {
        spotName: 'テスト画像付きスポット',
        address: '福岡県福岡市中央区天神2-2-2',
        districtId: district.id,
        spotType: 'STORE',
        images: [base64_image]
      }

      result = BackendSchema.execute(
        query,
        variables: variables,
        context: context
      ).to_h

      # エラーがないことを確認
      expect(result.dig('data', 'createSpot', 'errors')).to be_empty

      # Spotが作成されたことを確認
      created_spot = result.dig('data', 'createSpot', 'spot')
      expect(created_spot).not_to be_nil

      # 画像がアタッチされたことを確認
      spot = Spot.find(created_spot['id'])
      expect(spot.images).to be_attached
      expect(spot.images.count).to eq(1)
    end

    it '空の画像配列を渡してもエラーにならないこと' do
      variables = {
        spotName: 'テスト空画像配列スポット',
        address: '福岡県福岡市中央区天神3-3-3',
        districtId: district.id,
        spotType: 'STORE',
        images: []
      }

      result = BackendSchema.execute(
        query,
        variables: variables,
        context: context
      ).to_h

      # エラーがないことを確認
      expect(result.dig('data', 'createSpot', 'errors')).to be_empty

      # Spotが作成されたことを確認
      created_spot = result.dig('data', 'createSpot', 'spot')
      expect(created_spot).not_to be_nil
    end

    it '管理者権限がない場合はエラーを返すこと' do
      regular_user = create(:user, role: :user)
      context_with_regular_user = { current_user: regular_user }

      variables = {
        spotName: 'テストスポット',
        address: '福岡県福岡市中央区天神4-4-4',
        districtId: district.id,
        spotType: 'STORE'
      }

      result = BackendSchema.execute(
        query,
        variables: variables,
        context: context_with_regular_user
      ).to_h

      # エラーが返されることを確認
      expect(result.dig('data', 'createSpot', 'errors')).not_to be_empty
      expect(result.dig('data', 'createSpot', 'errors').first).to include('管理者権限')

      # Spotが作成されていないことを確認
      expect(result.dig('data', 'createSpot', 'spot')).to be_nil
    end
  end
end
