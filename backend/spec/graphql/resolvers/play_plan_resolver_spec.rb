# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Resolvers::PlayPlanResolver do
  let(:resolver) { described_class.new(object: nil, context: context, field: nil) }
  let(:context) { { current_user: current_user } }
  let(:current_user) { create(:user) }
  let(:plan_owner) { create(:user) }
  let(:paid_user) { create(:user, is_paid_member: true, paid_end_date: 1.month.from_now) }
  let(:play_plan) { create(:play_plan, user: plan_owner) }

  describe '#resolve' do
    context '未ログインの場合' do
      let(:context) { { current_user: nil } }

      it 'エラーを返すこと' do
        expect {
          resolver.resolve(id: play_plan.id)
        }.to raise_error(GraphQL::ExecutionError, 'ログインが必要です')
      end
    end

    context 'プランが存在しない場合' do
      it 'エラーを返すこと' do
        expect {
          resolver.resolve(id: 0)
        }.to raise_error(GraphQL::ExecutionError, '該当プランが見つかりません')
      end
    end

    context '有償ユーザーの場合' do
      let(:current_user) { paid_user }

      it 'プラン詳細を返すこと' do
        result = resolver.resolve(id: play_plan.id)
        expect(result).to eq(play_plan)
      end
    end

    context 'プラン作成者本人の場合' do
      let(:current_user) { plan_owner }

      it 'プラン詳細を返すこと' do
        result = resolver.resolve(id: play_plan.id)
        expect(result).to eq(play_plan)
      end
    end

    context '無償ユーザーかつプラン作成者でない場合' do
      it 'エラーを返すこと' do
        expect {
          resolver.resolve(id: play_plan.id)
        }.to raise_error(GraphQL::ExecutionError, 'こちらのページは課金しないと見れません')
      end
    end
  end
end
