# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::RemoveFavorite, type: :request do
  let(:user) { create(:user) }
  let(:play_plan) { create(:play_plan) }
  let(:context) { { current_user: user } }

  let(:query) do
    <<~GRAPHQL
      mutation RemoveFavorite($playPlanId: ID!) {
        removeFavorite(input: { playPlanId: $playPlanId }) {
          success
          errors
        }
      }
    GRAPHQL
  end

  describe 'プランをお気に入りから削除' do
    context '認証済みユーザーの場合' do
      context 'お気に入りが存在する場合' do
        before { create(:favorite, user: user, play_plan: play_plan) }

        it 'お気に入りを削除できる' do
          variables = { playPlanId: play_plan.id }

          expect {
            post '/graphql', params: { query: query, variables: variables }, headers: auth_headers(user)
          }.to change(Favorite, :count).by(-1)

          json = JSON.parse(response.body)
          data = json['data']['removeFavorite']

          expect(data['success']).to eq(true)
          expect(data['errors']).to be_empty
        end
      end

      context 'お気に入りが存在しない場合' do
        it 'エラーにならない（冪等性）' do
          variables = { playPlanId: play_plan.id }

          expect {
            post '/graphql', params: { query: query, variables: variables }, headers: auth_headers(user)
          }.not_to change(Favorite, :count)

          json = JSON.parse(response.body)
          data = json['data']['removeFavorite']

          expect(data['success']).to eq(true)
          expect(data['errors']).to be_empty
        end
      end
    end

    context '未認証ユーザーの場合' do
      it 'エラーを返す' do
        variables = { playPlanId: play_plan.id }

        expect {
          post '/graphql', params: { query: query, variables: variables }
        }.not_to change(Favorite, :count)

        json = JSON.parse(response.body)
        data = json['data']['removeFavorite']

        expect(data['success']).to eq(false)
        expect(data['errors']).to include('認証されていません。ログインしてください。')
      end
    end
  end
end
