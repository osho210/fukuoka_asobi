# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::CreateSpot, type: :request do
  let(:admin_user) { create(:user, admin: true) }
  let(:district) { create(:district) }
  
  let(:query) do
    <<~GQL
      mutation CreateSpot(
        $spotName: String!,
        $address: String!,
        $districtId: ID!,
        $spotType: String!,
        $isIndexable: Boolean
      ) {
        createSpot(
          spotName: $spotName,
          address: $address,
          districtId: $districtId,
          spotType: $spotType,
          isIndexable: $isIndexable
        ) {
          spot {
            id
            spotName
            address
            isIndexable
            isPublic
          }
          errors
        }
      }
    GQL
  end

  describe 'is_indexable のデフォルト値' do
    before do
      allow_any_instance_of(GraphqlController).to receive(:current_user).and_return(admin_user)
    end

    context 'is_indexable を指定しない場合' do
      let(:variables) do
        {
          spotName: 'テストスポット',
          address: 'テスト住所',
          districtId: district.id.to_s,
          spotType: 'STORE'
        }
      end

      it 'is_indexable が false になること' do
        post '/graphql', params: { query: query, variables: variables }

        json = JSON.parse(response.body)
        expect(json['data']['createSpot']['errors']).to be_empty
        expect(json['data']['createSpot']['spot']['isIndexable']).to eq(false)
        expect(json['data']['createSpot']['spot']['isPublic']).to eq(false)
      end
    end

    context 'is_indexable を true に指定した場合' do
      let(:variables) do
        {
          spotName: 'テストスポット',
          address: 'テスト住所',
          districtId: district.id.to_s,
          spotType: 'STORE',
          isIndexable: true
        }
      end

      it 'is_indexable が true になること' do
        post '/graphql', params: { query: query, variables: variables }

        json = JSON.parse(response.body)
        expect(json['data']['createSpot']['errors']).to be_empty
        expect(json['data']['createSpot']['spot']['isIndexable']).to eq(true)
      end
    end

    context 'is_indexable を false に指定した場合' do
      let(:variables) do
        {
          spotName: 'テストスポット',
          address: 'テスト住所',
          districtId: district.id.to_s,
          spotType: 'STORE',
          isIndexable: false
        }
      end

      it 'is_indexable が false になること' do
        post '/graphql', params: { query: query, variables: variables }

        json = JSON.parse(response.body)
        expect(json['data']['createSpot']['errors']).to be_empty
        expect(json['data']['createSpot']['spot']['isIndexable']).to eq(false)
      end
    end
  end

  describe '管理者権限チェック' do
    context '非管理者ユーザーの場合' do
      let(:non_admin_user) { create(:user, admin: false) }
      let(:variables) do
        {
          spotName: 'テストスポット',
          address: 'テスト住所',
          districtId: district.id.to_s,
          spotType: 'STORE'
        }
      end

      before do
        allow_any_instance_of(GraphqlController).to receive(:current_user).and_return(non_admin_user)
      end

      it 'エラーを返すこと' do
        post '/graphql', params: { query: query, variables: variables }

        json = JSON.parse(response.body)
        expect(json['data']['createSpot']['errors']).to include('管理者権限が必要です')
        expect(json['data']['createSpot']['spot']).to be_nil
      end
    end
  end
end
