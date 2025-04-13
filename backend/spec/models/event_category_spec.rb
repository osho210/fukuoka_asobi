require 'rails_helper'

RSpec.describe EventCategory, type: :model do
  describe 'バリデーション' do
    it 'nameがあれば有効であること' do
      event_category = EventCategory.new(
        name: 'フェス',
        description: '音楽フェスティバルなどのイベント'
      )
      expect(event_category).to be_valid
    end

    it 'nameがなければ無効であること' do
      event_category = EventCategory.new(name: nil)
      event_category.valid?
      expect(event_category.errors[:name]).to include("を入力してください")
    end
  end

  describe 'アソシエーション' do
    it 'has_many :events' do
      association = described_class.reflect_on_association(:events)
      expect(association.macro).to eq :has_many
    end

    it 'dependent: :nullify' do
      association = described_class.reflect_on_association(:events)
      expect(association.options[:dependent]).to eq :nullify
    end
  end
end
