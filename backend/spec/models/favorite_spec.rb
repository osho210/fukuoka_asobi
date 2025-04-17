# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Favorite, type: :model do
  describe 'アソシエーション' do
    it 'userに属している' do
      association = described_class.reflect_on_association(:user)
      expect(association.macro).to eq :belongs_to
    end

    it 'play_planに属している' do
      association = described_class.reflect_on_association(:play_plan)
      expect(association.macro).to eq :belongs_to
    end
  end

  describe 'バリデーション' do
    let(:user) { create(:user) }
    let(:play_plan) { create(:play_plan) }
    let(:favorite) { build(:favorite, user: user, play_plan: play_plan) }

    it '有効なファクトリを持つ' do
      expect(favorite).to be_valid
    end

    it 'user_idが必須' do
      favorite.user_id = nil
      expect(favorite).not_to be_valid
    end

    it 'play_plan_idが必須' do
      favorite.play_plan_id = nil
      expect(favorite).not_to be_valid
    end

    it '同一ユーザーが同一プランを重複登録できない' do
      favorite.save
      duplicate_favorite = build(:favorite, user: user, play_plan: play_plan)
      expect(duplicate_favorite).not_to be_valid
      expect(duplicate_favorite.errors[:user_id]).to include('は既にこのプランをお気に入りに登録しています')
    end
  end

  describe 'スコープ' do
    let(:user) { create(:user) }
    let(:play_plan1) { create(:play_plan) }
    let(:play_plan2) { create(:play_plan) }
    let!(:favorite1) { create(:favorite, user: user, play_plan: play_plan1, created_at: 1.day.ago) }
    let!(:favorite2) { create(:favorite, user: user, play_plan: play_plan2, created_at: Time.current) }

    describe '.latest' do
      it '作成日時の降順で取得する' do
        expect(Favorite.latest).to eq([favorite2, favorite1])
      end
    end

    describe '.by_user' do
      let(:another_user) { create(:user) }
      let!(:another_favorite) { create(:favorite, user: another_user, play_plan: play_plan1) }

      it '指定したユーザーのお気に入りのみを取得する' do
        expect(Favorite.by_user(user.id)).to contain_exactly(favorite1, favorite2)
        expect(Favorite.by_user(user.id)).not_to include(another_favorite)
      end
    end
  end

  describe '関連削除' do
    let(:user) { create(:user) }
    let(:play_plan) { create(:play_plan) }
    let!(:favorite) { create(:favorite, user: user, play_plan: play_plan) }

    it 'ユーザーが削除されると、そのユーザーのお気に入りも削除される' do
      expect { user.destroy }.to change(Favorite, :count).by(-1)
    end

    it 'プランが削除されると、そのプランのお気に入りも削除される' do
      expect { play_plan.destroy }.to change(Favorite, :count).by(-1)
    end
  end
end
