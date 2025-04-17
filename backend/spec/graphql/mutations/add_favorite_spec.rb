# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::AddFavorite, type: :request do
  let(:user) { create(:user) }
  let(:play_plan) { create(:play_plan) }
  let(:context) { { current_user: user } }

  let(:query) do
    <<~GRAPHQL
      mutation AddFavorite($playPlanId: ID!) {
        addFavorite(input: { playPlanId: $playPlanId }) {
          favorite {
            id
            userId
            playPlanId
          }
          errors
        }
      }
    GRAPHQL
  end

  describe 'プランをお気に入りに追加' do
    context '認証済みユーザーの場合' do
      it 'お気に入りを追加できる' do
        variables = { playPlanId: play_plan.id }

        expect {
          post '/graphql', params: { query: query, variables: variables }, headers: auth_headers(user)
        }.to change(Favorite, :count).by(1)

        json = JSON.parse(response.body)
        data = json['data']['addFavorite']

        expect(data['favorite']).to be_present
        expect(data['favorite']['userId']).to eq(user.id)
        expect(data['favorite']['playPlanId']).to eq(play_plan.id)
        expect(data['errors']).to be_empty
      end

      context '既にお気に入りに登録されている場合' do
        before { create(:favorite, user: user, play_plan: play_plan) }

        it '重複登録されない（冪等性）' do
          variables = { playPlanId: play_plan.id }

          expect {
            post '/graphql', params: { query: query, variables: variables }, headers: auth_headers(user)
          }.not_to change(Favorite, :count)

          json = JSON.parse(response.body)
          data = json['data']['addFavorite']

          expect(data['favorite']).to be_present
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
        data = json['data']['addFavorite']

        expect(data['favorite']).to be_nil
        expect(data['errors']).to include('認証されていません。ログインしてください。')
      end
    end

    context '存在しないプランの場合' do
      it 'エラーを返す' do
        variables = { playPlanId: 999 }

        expect {
          post '/graphql', params: { query: query, variables: variables }, headers: auth_headers(user)
        }.not_to change(Favorite, :count)

        json = JSON.parse(response.body)
        data = json['data']['addFavorite']

        expect(data['favorite']).to be_nil
        expect(data['errors']).to include('プランが見つかりません。')
      end
    end
  end
end
