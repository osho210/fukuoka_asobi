# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserHistory, type: :model do
  describe 'アソシエーション' do
    it 'userに属している' do
      association = described_class.reflect_on_association(:user)
      expect(association.macro).to eq :belongs_to
    end

    it 'viewableに属している（ポリモーフィック）' do
      association = described_class.reflect_on_association(:viewable)
      expect(association.macro).to eq :belongs_to
      expect(association.options[:polymorphic]).to be true
    end
  end

  describe 'バリデーション' do
    let(:user) { create(:user) }
    let(:news) { create(:news) }
    let(:user_history) { build(:user_history, user: user, viewable: news) }

    it '有効なファクトリを持つ' do
      expect(user_history).to be_valid
    end

    it 'user_idが必須' do
      user_history.user_id = nil
      expect(user_history).not_to be_valid
    end

    it 'viewable_typeが必須' do
      user_history.viewable_type = nil
      expect(user_history).not_to be_valid
    end

    it 'viewable_idが必須' do
      user_history.viewable_id = nil
      expect(user_history).not_to be_valid
    end

    it 'viewed_atが必須' do
      user_history.viewed_at = nil
      expect(user_history).not_to be_valid
    end
  end

  describe 'スコープ' do
    let(:user) { create(:user) }
    let(:news1) { create(:news) }
    let(:news2) { create(:news) }
    let!(:history1) { create(:user_history, user: user, viewable: news1, viewed_at: 1.day.ago) }
    let!(:history2) { create(:user_history, user: user, viewable: news2, viewed_at: Time.current) }

    describe '.latest' do
      it '閲覧日時の降順で取得する' do
        expect(UserHistory.latest).to eq([history2, history1])
      end
    end

    describe '.by_user' do
      let(:another_user) { create(:user) }
      let!(:another_history) { create(:user_history, user: another_user, viewable: news1) }

      it '指定したユーザーの閲覧履歴のみを取得する' do
        expect(UserHistory.by_user(user.id)).to contain_exactly(history1, history2)
        expect(UserHistory.by_user(user.id)).not_to include(another_history)
      end
    end

    describe '.by_type' do
      let(:magazine) { create(:magazine) }
      let!(:magazine_history) { create(:user_history, user: user, viewable: magazine) }

      it '指定したタイプの閲覧履歴のみを取得する' do
        expect(UserHistory.by_type('News')).to contain_exactly(history1, history2)
        expect(UserHistory.by_type('Magazine')).to contain_exactly(magazine_history)
      end
    end

    describe '.within_period' do
      let!(:old_history) { create(:user_history, user: user, viewable: news1, viewed_at: 10.days.ago) }
      let!(:recent_history) { create(:user_history, user: user, viewable: news2, viewed_at: 3.days.ago) }

      it '指定期間内の閲覧履歴を取得する' do
        start_date = 5.days.ago
        end_date = 1.day.ago
        expect(UserHistory.within_period(start_date, end_date)).to contain_exactly(recent_history)
      end
    end
  end

  describe '.record_view' do
    let(:user) { create(:user) }
    let(:news) { create(:news) }

    context '新規閲覧の場合' do
      it '新しい閲覧履歴を作成する' do
        expect {
          UserHistory.record_view(user.id, news)
        }.to change(UserHistory, :count).by(1)
      end

      it '正しい属性で作成される' do
        UserHistory.record_view(user.id, news)
        history = UserHistory.last
        expect(history.user_id).to eq(user.id)
        expect(history.viewable).to eq(news)
        expect(history.viewed_at).to be_within(1.second).of(Time.current)
      end
    end

    context '既存の閲覧履歴がある場合' do
      let!(:existing_history) { create(:user_history, user: user, viewable: news, viewed_at: 1.day.ago) }

      it '新しいレコードを作成しない' do
        expect {
          UserHistory.record_view(user.id, news)
        }.not_to change(UserHistory, :count)
      end

      it 'viewed_atを更新する' do
        old_viewed_at = existing_history.viewed_at
        UserHistory.record_view(user.id, news)
        existing_history.reload
        expect(existing_history.viewed_at).to be > old_viewed_at
        expect(existing_history.viewed_at).to be_within(1.second).of(Time.current)
      end
    end
  end

  describe 'ポリモーフィック関連' do
    let(:user) { create(:user) }

    it 'Newsを閲覧対象として設定できる' do
      news = create(:news)
      history = create(:user_history, user: user, viewable: news)
      expect(history.viewable_type).to eq('News')
      expect(history.viewable).to eq(news)
    end

    it 'Magazineを閲覧対象として設定できる' do
      magazine = create(:magazine)
      history = create(:user_history, user: user, viewable: magazine)
      expect(history.viewable_type).to eq('Magazine')
      expect(history.viewable).to eq(magazine)
    end

    it 'PlayPlanを閲覧対象として設定できる' do
      play_plan = create(:play_plan)
      history = create(:user_history, user: user, viewable: play_plan)
      expect(history.viewable_type).to eq('PlayPlan')
      expect(history.viewable).to eq(play_plan)
    end
  end

  describe '関連削除' do
    let(:user) { create(:user) }
    let(:news) { create(:news) }
    let!(:user_history) { create(:user_history, user: user, viewable: news) }

    it 'ユーザーが削除されると、そのユーザーの閲覧履歴も削除される' do
      expect { user.destroy }.to change(UserHistory, :count).by(-1)
    end

    it '閲覧対象が削除されると、その閲覧履歴も削除される' do
      expect { news.destroy }.to change(UserHistory, :count).by(-1)
    end
  end
end
