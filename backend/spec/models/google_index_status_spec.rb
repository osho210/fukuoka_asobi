# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIndexStatus, type: :model do
  describe 'associations' do
    it { should belong_to(:indexable) }
  end

  describe 'validations' do
    it { should validate_presence_of(:inspected_url) }
    it { should validate_presence_of(:indexable_type) }
    it { should validate_presence_of(:indexable_id) }
  end

  describe '#indexed?' do
    context 'coverage_stateに"indexed"が含まれる場合' do
      let(:status) { build(:google_index_status, coverage_state: 'Submitted and indexed') }
      
      it 'trueを返すこと' do
        expect(status.indexed?).to be true
      end
    end

    context 'coverage_stateに"Indexed"が含まれる場合' do
      let(:status) { build(:google_index_status, coverage_state: 'Indexed, not submitted in sitemap') }
      
      it 'trueを返すこと' do
        expect(status.indexed?).to be true
      end
    end

    context 'coverage_stateに"indexed"が含まれない場合' do
      let(:status) { build(:google_index_status, coverage_state: 'Discovered - currently not indexed') }
      
      it 'falseを返すこと' do
        expect(status.indexed?).to be false
      end
    end

    context 'coverage_stateがnilの場合' do
      let(:status) { build(:google_index_status, coverage_state: nil) }
      
      it 'falseを返すこと' do
        expect(status.indexed?).to be false
      end
    end
  end

  describe '#crawled?' do
    context 'last_crawl_timeが存在する場合' do
      let(:status) { build(:google_index_status, last_crawl_time: Time.current) }
      
      it 'trueを返すこと' do
        expect(status.crawled?).to be true
      end
    end

    context 'last_crawl_timeがnilの場合' do
      let(:status) { build(:google_index_status, last_crawl_time: nil) }
      
      it 'falseを返すこと' do
        expect(status.crawled?).to be false
      end
    end
  end

  describe '#indexable?' do
    context 'indexing_allowedがtrueの場合' do
      let(:status) { build(:google_index_status, indexing_allowed: true) }
      
      it 'trueを返すこと' do
        expect(status.indexable?).to be true
      end
    end

    context 'indexing_allowedがfalseの場合' do
      let(:status) { build(:google_index_status, indexing_allowed: false) }
      
      it 'falseを返すこと' do
        expect(status.indexable?).to be false
      end
    end
  end

  describe '#not_indexed_reason' do
    context 'インデックスされている場合' do
      let(:status) { build(:google_index_status, coverage_state: 'Submitted and indexed') }
      
      it 'nilを返すこと' do
        expect(status.not_indexed_reason).to be_nil
      end
    end

    context 'インデックスされていない場合' do
      let(:status) { build(:google_index_status, coverage_state: 'Excluded by noindex tag') }
      
      it 'coverage_stateを返すこと' do
        expect(status.not_indexed_reason).to eq('Excluded by noindex tag')
      end
    end

    context 'coverage_stateがnilの場合' do
      let(:status) { build(:google_index_status, coverage_state: nil) }
      
      it '不明を返すこと' do
        expect(status.not_indexed_reason).to eq('不明')
      end
    end
  end

  describe '#status_color' do
    let(:spot) { create(:spot, is_indexable: true, is_public: true) }

    context '設定OK & Indexedの場合' do
      let(:status) do
        create(:google_index_status,
               indexable: spot,
               coverage_state: 'Submitted and indexed')
      end
      
      it 'greenを返すこと' do
        expect(status.status_color).to eq('green')
      end
    end

    context '設定OK & Not Indexedの場合' do
      let(:status) do
        create(:google_index_status,
               indexable: spot,
               coverage_state: 'Discovered - currently not indexed')
      end
      
      it 'yellowを返すこと' do
        expect(status.status_color).to eq('yellow')
      end
    end

    context '設定NG & Indexedの場合' do
      let(:spot_noindex) { create(:spot, is_indexable: false, is_public: true) }
      let(:status) do
        create(:google_index_status,
               indexable: spot_noindex,
               coverage_state: 'Submitted and indexed')
      end
      
      it 'redを返すこと' do
        expect(status.status_color).to eq('red')
      end
    end

    context '設定NG & Not Indexedの場合' do
      let(:spot_draft) { create(:spot, is_indexable: true, is_public: false) }
      let(:status) do
        create(:google_index_status,
               indexable: spot_draft,
               coverage_state: 'Discovered - currently not indexed')
      end
      
      it 'grayを返すこと' do
        expect(status.status_color).to eq('gray')
      end
    end
  end
end
