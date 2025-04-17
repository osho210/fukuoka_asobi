# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Favorites::ToggleService do
  let(:user) { create(:user) }
  let(:play_plan) { create(:play_plan) }
  let(:service) { described_class.new(user: user, play_plan_id: play_plan.id) }

  describe '#call' do
    context 'ユーザーが存在しない場合' do
      let(:service) { described_class.new(user: nil, play_plan_id: play_plan.id) }

      it 'エラーを返す' do
        result = service.call
        expect(result[:success]).to eq(false)
        expect(result[:errors]).to include('ユーザーが見つかりません。')
      end
    end

    context 'プランが存在しない場合' do
      let(:service) { described_class.new(user: user, play_plan_id: 999) }

      it 'エラーを返す' do
        result = service.call
        expect(result[:success]).to eq(false)
        expect(result[:errors]).to include('プランが見つかりません。')
      end
    end

    context 'アクションが指定されていない場合' do
      context 'お気に入りが存在しない場合' do
        it 'お気に入りを追加する' do
          expect { service.call }.to change(Favorite, :count).by(1)
          expect(user.favorites.exists?(play_plan_id: play_plan.id)).to be true
        end

        it '成功レスポンスを返す' do
          result = service.call
          expect(result[:success]).to eq(true)
          expect(result[:favorite]).to be_present
          expect(result[:errors]).to be_empty
        end
      end

      context 'お気に入りが既に存在する場合' do
        before { create(:favorite, user: user, play_plan: play_plan) }

        it 'お気に入りを削除する' do
          expect { service.call }.to change(Favorite, :count).by(-1)
          expect(user.favorites.exists?(play_plan_id: play_plan.id)).to be false
        end

        it '成功レスポンスを返す' do
          result = service.call
          expect(result[:success]).to eq(true)
          expect(result[:errors]).to be_empty
        end
      end
    end

    context 'アクションが"add"の場合' do
      let(:service) { described_class.new(user: user, play_plan_id: play_plan.id, action: 'add') }

      it 'お気に入りを追加する' do
        expect { service.call }.to change(Favorite, :count).by(1)
      end

      context 'お気に入りが既に存在する場合' do
        before { create(:favorite, user: user, play_plan: play_plan) }

        it 'お気に入りを追加しない（冪等性）' do
          expect { service.call }.not_to change(Favorite, :count)
        end

        it '既存のお気に入りを返す' do
          result = service.call
          expect(result[:success]).to eq(true)
          expect(result[:favorite]).to be_present
          expect(result[:errors]).to be_empty
        end
      end
    end

    context 'アクションが"remove"の場合' do
      let(:service) { described_class.new(user: user, play_plan_id: play_plan.id, action: 'remove') }

      context 'お気に入りが存在する場合' do
        before { create(:favorite, user: user, play_plan: play_plan) }

        it 'お気に入りを削除する' do
          expect { service.call }.to change(Favorite, :count).by(-1)
        end
      end

      context 'お気に入りが存在しない場合' do
        it 'エラーにならない（冪等性）' do
          expect { service.call }.not_to change(Favorite, :count)
          result = service.call
          expect(result[:success]).to eq(true)
          expect(result[:errors]).to be_empty
        end
      end
    end

    context '無効なアクションの場合' do
      let(:service) { described_class.new(user: user, play_plan_id: play_plan.id, action: 'invalid') }

      it 'エラーを返す' do
        result = service.call
        expect(result[:success]).to eq(false)
        expect(result[:errors]).to include('無効なアクション: invalid')
      end
    end
  end

  describe 'イベント通知' do
    it 'お気に入り追加時にイベントを発火する' do
      expect(ActiveSupport::Notifications).to receive(:instrument).with(
        'favorite.added',
        user_id: user.id,
        play_plan_id: play_plan.id
      )
      service.call
    end

    it 'お気に入り削除時にイベントを発火する' do
      create(:favorite, user: user, play_plan: play_plan)
      expect(ActiveSupport::Notifications).to receive(:instrument).with(
        'favorite.removed',
        user_id: user.id,
        play_plan_id: play_plan.id
      )
      service.call
    end
  end
end
