require 'rails_helper'

RSpec.describe Spot, type: :model do
  describe 'associations' do
    it { should belong_to(:district) }
    it { should have_many(:opening_hours).dependent(:destroy) }
    it { should have_many(:spot_areas).dependent(:destroy) }
    it { should have_many(:areas).through(:spot_areas) }
    it { should have_many(:spot_categories).dependent(:destroy) }
    it { should have_many(:categories).through(:spot_categories) }
    it { should have_many(:spot_hashtags).dependent(:destroy) }
    it { should have_many(:hashtags).through(:spot_hashtags) }
    # 以下のテストはモデルが存在しない場合はコメントアウト
    # it { should have_many(:spot_instagram_embeds).dependent(:destroy) }
    # it { should have_many(:instagram_embeds).through(:spot_instagram_embeds) }
    # it { should have_many(:spot_menus).dependent(:destroy) }
    # it { should have_many(:menus).through(:spot_menus) }
    it { should have_many(:spot_ambiance_relations).dependent(:destroy) }
    it { should have_many(:spot_ambiances).through(:spot_ambiance_relations) }
    it { should have_many(:spot_purposes).dependent(:destroy) }
    it { should have_many(:purposes).through(:spot_purposes) }
  end

  describe 'validations' do
    it { should validate_presence_of(:spot_name) }
    it { should validate_inclusion_of(:budget_range).in_array(%w(安い 普通 高い)).allow_nil }
    it { should validate_inclusion_of(:theme).in_array(%w(癒しの旅 アクティブ コスパ グルメ 自然 文化と歴史)).allow_nil }
    it { should validate_numericality_of(:review_rating).is_greater_than_or_equal_to(0).is_less_than_or_equal_to(5).allow_nil }
    it { should validate_inclusion_of(:spot_type).in_array(%w(STORE TOURIST_SPOT ACTIVITY)) }
  end

  describe 'default values' do
    let(:district) { create(:district) }
    let(:spot) { Spot.create!(district: district, spot_name: 'テストスポット', spot_type: 'STORE', address: 'テスト住所') }

    it 'is_indexable のデフォルト値が false であること' do
      expect(spot.is_indexable).to eq(false)
    end

    it 'is_public のデフォルト値が false であること' do
      expect(spot.is_public).to eq(false)
    end
  end

  describe 'scopes' do
    describe '.publicly_visible' do
      let(:district) { create(:district) }
      let!(:public_spot1) { create(:spot, district: district, spot_name: '公開スポット1', spot_type: 'STORE', is_public: true) }
      let!(:public_spot2) { create(:spot, district: district, spot_name: '公開スポット2', spot_type: 'STORE', is_public: true) }
      let!(:private_spot) { create(:spot, district: district, spot_name: '非公開スポット', spot_type: 'STORE', is_public: false) }

      it '公開されているスポットのみを返すこと' do
        result = Spot.publicly_visible
        expect(result).to include(public_spot1, public_spot2)
        expect(result).not_to include(private_spot)
      end
    end
  end

  describe '#opening_hour_list' do
    let(:district) { create(:district) }
    let(:spot) { create(:spot, district: district, spot_name: 'テストスポット', spot_type: 'STORE') }

    context '営業時間が登録されている場合' do
      before do
        create(:opening_hour,
          spot: spot,
          day_of_week: '月',
          open_time: Time.zone.parse('10:00'),
          close_time: Time.zone.parse('18:00')
        )
        create(:opening_hour,
          spot: spot,
          day_of_week: '火',
          open_time: Time.zone.parse('11:00'),
          close_time: Time.zone.parse('19:00')
        )
      end

      it '営業時間のリストを正しいフォーマットで返すこと' do
        result = spot.opening_hour_list
        expect(result).to be_an(Array)
        expect(result.size).to eq(2)

        expect(result[0][:day_of_week]).to eq('月')
        expect(result[0][:business_hour]).to eq('10:00 ~ 18:00')

        expect(result[1][:day_of_week]).to eq('火')
        expect(result[1][:business_hour]).to eq('11:00 ~ 19:00')
      end
    end

    context '営業時間が登録されていない場合' do
      it '空の配列を返すこと' do
        result = spot.opening_hour_list
        expect(result).to eq([])
      end
    end
  end
end
