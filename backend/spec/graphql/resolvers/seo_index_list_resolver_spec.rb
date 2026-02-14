# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Resolvers::SeoIndexListResolver do
  let(:resolver) { described_class.new(object: nil, context: {}, field: nil) }

  describe '#resolve' do
    let!(:published_spot) { create(:spot, spot_name: 'Published Spot', is_public: true, is_indexable: true) }
    let!(:draft_spot) { create(:spot, spot_name: 'Draft Spot', is_public: false, is_indexable: true) }
    let!(:noindex_spot) { create(:spot, spot_name: 'NoIndex Spot', is_public: true, is_indexable: false) }
    let!(:published_plan) { create(:play_plan, plan_name: 'Published Plan', is_public: true, is_indexable: true) }
    let!(:draft_plan) { create(:play_plan, plan_name: 'Draft Plan', is_public: false, is_indexable: true) }
    let!(:noindex_plan) { create(:play_plan, plan_name: 'NoIndex Plan', is_public: true, is_indexable: false) }

    context 'フィルタなしの場合' do
      it 'すべてのスポットとプランを返すこと' do
        result = resolver.resolve(type: nil, is_indexable: nil, status: nil)
        expect(result.size).to eq(6)
      end

      it '更新日時でソートされていること' do
        result = resolver.resolve(type: nil, is_indexable: nil, status: nil)
        dates = result.map(&:updated_at)
        expect(dates).to eq(dates.sort.reverse)
      end
    end

    context 'type=spotでフィルタする場合' do
      it 'スポットのみを返すこと' do
        result = resolver.resolve(type: 'spot', is_indexable: nil, status: nil)
        expect(result.size).to eq(3)
        expect(result.all? { |r| r.type == 'spot' }).to be true
      end
    end

    context 'type=planでフィルタする場合' do
      it 'プランのみを返すこと' do
        result = resolver.resolve(type: 'plan', is_indexable: nil, status: nil)
        expect(result.size).to eq(3)
        expect(result.all? { |r| r.type == 'plan' }).to be true
      end
    end

    context 'is_indexable=trueでフィルタする場合' do
      it 'is_indexableがtrueのレコードのみを返すこと' do
        result = resolver.resolve(type: nil, is_indexable: true, status: nil)
        expect(result.size).to eq(4)
        expect(result.all?(&:is_indexable)).to be true
      end
    end

    context 'is_indexable=falseでフィルタする場合' do
      it 'is_indexableがfalseのレコードのみを返すこと' do
        result = resolver.resolve(type: nil, is_indexable: false, status: nil)
        expect(result.size).to eq(2)
        expect(result.none?(&:is_indexable)).to be true
      end
    end

    context 'status=publishedでフィルタする場合' do
      it '公開ステータスのレコードのみを返すこと' do
        result = resolver.resolve(type: nil, is_indexable: nil, status: 'published')
        expect(result.size).to eq(3)
        expect(result.all? { |r| r.status == 'published' }).to be true
      end
    end

    context 'status=draftでフィルタする場合' do
      it '下書きステータスのレコードのみを返すこと' do
        result = resolver.resolve(type: nil, is_indexable: nil, status: 'draft')
        expect(result.size).to eq(2)
        expect(result.all? { |r| r.status == 'draft' }).to be true
      end
    end

    context '複数条件でフィルタする場合' do
      it '正しくフィルタされること' do
        result = resolver.resolve(type: 'plan', is_indexable: true, status: 'published')
        expect(result.size).to eq(1)
        expect(result.first.title).to eq('Published Plan')
        expect(result.first.type).to eq('plan')
        expect(result.first.is_indexable).to be true
        expect(result.first.status).to eq('published')
      end
    end

    context 'URLが正しく生成されること' do
      it 'スポットのURLが正しいこと' do
        result = resolver.resolve(type: 'spot', is_indexable: nil, status: nil)
        spot_result = result.find { |r| r.id == published_spot.id }
        expect(spot_result.url).to match(/\/spots\/#{published_spot.id}$/)
      end

      it 'プランのURLが正しいこと' do
        result = resolver.resolve(type: 'plan', is_indexable: nil, status: nil)
        plan_result = result.find { |r| r.id == published_plan.id }
        expect(plan_result.url).to match(/\/play_plans\/#{published_plan.id}$/)
      end
    end

    context 'レスポンスの形式が正しいこと' do
      it '必須フィールドが全て含まれていること' do
        result = resolver.resolve(type: nil, is_indexable: nil, status: nil)
        first_record = result.first

        expect(first_record.id).to be_present
        expect(first_record.title).to be_present
        expect(first_record.type).to be_present
        expect(first_record.status).to be_present
        expect(first_record.is_indexable).not_to be_nil
        expect(first_record.url).to be_present
        expect(first_record.updated_at).to be_present
      end

      it 'statusは常に値が入っていること' do
        result = resolver.resolve(type: nil, is_indexable: nil, status: nil)
        expect(result.all? { |r| r.status.present? }).to be true
      end
    end

    context 'google_index_statusが関連付けられている場合' do
      let!(:google_status) do
        create(:google_index_status,
               indexable: published_spot,
               coverage_state: 'Submitted and indexed')
      end

      it 'google_index_statusが取得できること' do
        result = resolver.resolve(type: 'spot', is_indexable: nil, status: nil)
        spot_result = result.find { |r| r.id == published_spot.id }
        expect(spot_result.google_index_status).to eq(google_status)
      end
    end
  end
end
