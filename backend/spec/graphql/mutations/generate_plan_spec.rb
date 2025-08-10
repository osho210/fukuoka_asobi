# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::GeneratePlan, type: :request do
  let(:user) { create(:user) }
  let(:district) { create(:district) }
  let(:query) do
    <<~GQL
      mutation GeneratePlan(
        $districts: [ID!]!,
        $date: String!,
        $memberInfo: MemberInfoInput!,
        $budget: BudgetInput!,
        $startTime: String,
        $endTime: String,
        $customOptions: CustomOptionsInput
      ) {
        generatePlan(
          districts: $districts,
          date: $date,
          memberInfo: $memberInfo,
          budget: $budget,
          startTime: $startTime,
          endTime: $endTime,
          customOptions: $customOptions
        ) {
          plan {
            id
            planName
            description
          }
          errors
        }
      }
    GQL
  end

  let(:variables) do
    {
      districts: [district.id.to_s],
      date: Date.today.to_s,
      memberInfo: {
        recommendUsers: [1]
      },
      budget: {
        min: 0,
        max: 10000
      }
    }
  end

  describe '認証チェック' do
    context '未ログイン状態' do
      it 'エラーを返す' do
        post '/graphql', params: { query: query, variables: variables }

        json = JSON.parse(response.body)
        expect(json['data']['generatePlan']['errors']).to include('ログインが必要です')
        expect(json['data']['generatePlan']['plan']).to be_nil
      end
    end

    context 'ログイン状態' do
      before do
        # ログイン状態をシミュレート
        allow_any_instance_of(GraphqlController).to receive(:current_user).and_return(user)

        # PlanGeneratorのモック
        plan = PlayPlan.new(
          id: 1,
          plan_name: 'テストプラン',
          description: 'テスト用のプラン説明',
          user: user
        )
        allow_any_instance_of(Services::PlanGenerator).to receive(:generate).and_return(plan)
      end

      it 'プランを生成し、ユーザーと関連付ける' do
        post '/graphql', params: { query: query, variables: variables }

        json = JSON.parse(response.body)
        expect(json['data']['generatePlan']['errors']).to be_empty
        expect(json['data']['generatePlan']['plan']).not_to be_nil
        expect(json['data']['generatePlan']['plan']['planName']).to eq('テストプラン')
      end
    end
  end
end
