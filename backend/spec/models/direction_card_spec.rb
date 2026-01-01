require 'rails_helper'

RSpec.describe DirectionCard, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:text) }
    it { should validate_length_of(:text).is_at_most(200) }
    it { should validate_numericality_of(:weight).only_integer.is_greater_than_or_equal_to(1) }
  end

  describe 'scopes' do
    let!(:active_card) { create(:direction_card, active: true) }
    let!(:inactive_card) { create(:direction_card, active: false) }

    describe '.active' do
      it 'アクティブなカードのみを取得すること' do
        expect(DirectionCard.active).to include(active_card)
        expect(DirectionCard.active).not_to include(inactive_card)
      end
    end

    describe '.weighted_random' do
      let!(:high_weight_card) { create(:direction_card, weight: 5, active: true) }
      let!(:low_weight_card) { create(:direction_card, weight: 1, active: true) }

      it '指定された件数のカードを取得すること' do
        result = DirectionCard.weighted_random(2)
        expect(result.size).to eq(2)
      end

      it 'アクティブなカードのみを取得すること' do
        result = DirectionCard.weighted_random(10)
        expect(result).not_to include(inactive_card)
      end
    end
  end

  describe '#tag_array' do
    let(:card) { create(:direction_card, tags: '静か,落ち着き,リラックス') }

    it 'タグ文字列を配列として取得できること' do
      expect(card.tag_array).to eq(['静か', '落ち着き', 'リラックス'])
    end

    context 'タグが空の場合' do
      let(:card_without_tags) { create(:direction_card, tags: nil) }

      it '空配列を返すこと' do
        expect(card_without_tags.tag_array).to eq([])
      end
    end
  end

  describe '#tag_array=' do
    let(:card) { create(:direction_card) }

    it 'タグ配列を文字列として設定できること' do
      card.tag_array = ['静か', '会話', 'カフェ']
      expect(card.tags).to eq('静か,会話,カフェ')
    end
  end
end
