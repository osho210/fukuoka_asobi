require 'rails_helper'

RSpec.describe ExperienceCard, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_length_of(:title).is_at_most(100) }
    it { should validate_length_of(:body).is_at_most(500) }
    it { should validate_numericality_of(:duration).only_integer.is_greater_than(0).allow_nil }
  end

  describe 'scopes' do
    let!(:active_card) { create(:experience_card, active: true) }
    let!(:inactive_card) { create(:experience_card, active: false) }

    describe '.active' do
      it 'アクティブなカードのみを取得すること' do
        expect(ExperienceCard.active).to include(active_card)
        expect(ExperienceCard.active).not_to include(inactive_card)
      end
    end

    describe '.by_tags' do
      let!(:cafe_card) { create(:experience_card, tags: '静か,会話,カフェ', active: true) }
      let!(:outdoor_card) { create(:experience_card, tags: '自然,公園,屋外', active: true) }

      context 'タグが指定されている場合' do
        it '指定されたタグを含むカードを取得すること' do
          result = ExperienceCard.by_tags(['カフェ'])
          expect(result).to include(cafe_card)
          expect(result).not_to include(outdoor_card)
        end

        it '複数のタグで検索できること' do
          result = ExperienceCard.by_tags(['カフェ', '公園'])
          expect(result).to include(cafe_card)
          expect(result).to include(outdoor_card)
        end
      end

      context 'タグが指定されていない場合' do
        it 'すべてのアクティブなカードを取得すること' do
          result = ExperienceCard.by_tags([])
          expect(result).to include(cafe_card)
          expect(result).to include(outdoor_card)
        end
      end
    end

    describe '.order_by_tag_matches' do
      let!(:perfect_match) { create(:experience_card, tags: '静か,会話,カフェ', active: true) }
      let!(:partial_match) { create(:experience_card, tags: '静か,自然', active: true) }
      let!(:no_match) { create(:experience_card, tags: '体験,アクティビティ', active: true) }

      it 'タグの一致数が多い順にソートすること' do
        result = ExperienceCard.order_by_tag_matches(['静か', '会話', 'カフェ']).to_a
        expect(result.first).to eq(perfect_match)
      end
    end
  end

  describe '#tag_array' do
    let(:card) { create(:experience_card, tags: '静か,会話,カフェ') }

    it 'タグ文字列を配列として取得できること' do
      expect(card.tag_array).to eq(['静か', '会話', 'カフェ'])
    end

    context 'タグが空の場合' do
      let(:card_without_tags) { create(:experience_card, tags: nil) }

      it '空配列を返すこと' do
        expect(card_without_tags.tag_array).to eq([])
      end
    end
  end

  describe '#tag_array=' do
    let(:card) { create(:experience_card) }

    it 'タグ配列を文字列として設定できること' do
      card.tag_array = ['静か', '会話', 'カフェ']
      expect(card.tags).to eq('静か,会話,カフェ')
    end
  end

  describe '#truncated_body' do
    let(:short_body) { '短い本文です。' }
    let(:long_body) { 'あ' * 150 }

    context '本文が短い場合' do
      let(:card) { create(:experience_card, body: short_body) }

      it '本文をそのまま返すこと' do
        expect(card.truncated_body(100)).to eq(short_body)
      end
    end

    context '本文が長い場合' do
      let(:card) { create(:experience_card, body: long_body) }

      it '指定された長さで省略すること' do
        result = card.truncated_body(100)
        expect(result.length).to eq(103) # 100文字 + '...'
        expect(result).to end_with('...')
      end
    end

    context '本文が空の場合' do
      let(:card) { create(:experience_card, body: nil) }

      it '空文字列を返すこと' do
        expect(card.truncated_body).to eq('')
      end
    end
  end
end
