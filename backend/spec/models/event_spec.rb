require 'rails_helper'

RSpec.describe Event, type: :model do
  let(:event_category) { EventCategory.create(name: 'フェス', description: '音楽フェスティバルなどのイベント') }

  describe 'バリデーション' do
    it '必須項目が全て存在すれば有効であること' do
      event = Event.new(
        title: 'サンプルイベント',
        description: 'イベントの説明文',
        location: '福岡市中央区',
        latitude: 33.5902,
        longitude: 130.4017,
        start_datetime: Time.current + 1.day,
        end_datetime: Time.current + 1.day + 2.hours,
        event_category: event_category,
        status: :published
      )
      expect(event).to be_valid
    end

    it 'titleがなければ無効であること' do
      event = Event.new(title: nil)
      event.valid?
      expect(event.errors[:title]).to include("を入力してください")
    end

    it 'descriptionがなければ無効であること' do
      event = Event.new(description: nil)
      event.valid?
      expect(event.errors[:description]).to include("を入力してください")
    end

    it 'locationがなければ無効であること' do
      event = Event.new(location: nil)
      event.valid?
      expect(event.errors[:location]).to include("を入力してください")
    end

    it 'start_datetimeがなければ無効であること' do
      event = Event.new(start_datetime: nil)
      event.valid?
      expect(event.errors[:start_datetime]).to include("を入力してください")
    end

    it 'end_datetimeがなければ無効であること' do
      event = Event.new(end_datetime: nil)
      event.valid?
      expect(event.errors[:end_datetime]).to include("を入力してください")
    end

    it 'end_datetimeがstart_datetimeより前の場合は無効であること' do
      event = Event.new(
        title: 'サンプルイベント',
        description: 'イベントの説明文',
        location: '福岡市中央区',
        start_datetime: Time.current + 1.day,
        end_datetime: Time.current,
        event_category: event_category,
        status: :published
      )
      event.valid?
      expect(event.errors[:end_datetime]).to include('はイベント開始日時より後の日時を設定してください')
    end
  end

  describe 'アソシエーション' do
    it 'belongs_to :event_category' do
      association = described_class.reflect_on_association(:event_category)
      expect(association.macro).to eq :belongs_to
    end
  end

  describe 'enum' do
    it 'statusは draft, published, canceled を持つこと' do
      expect(described_class.statuses).to include('draft', 'published', 'canceled')
    end
  end

  describe 'スコープ' do
    let!(:past_event) do
      Event.create!(
        title: '過去のイベント',
        description: '過去のイベントの説明',
        location: '福岡市中央区',
        start_datetime: Time.current - 2.days,
        end_datetime: Time.current - 1.day,
        event_category: event_category,
        status: :published
      )
    end

    let!(:upcoming_event) do
      Event.create!(
        title: '今後のイベント',
        description: '今後のイベントの説明',
        location: '福岡市中央区',
        start_datetime: Time.current + 1.day,
        end_datetime: Time.current + 2.days,
        event_category: event_category,
        status: :published
      )
    end

    let!(:draft_event) do
      Event.create!(
        title: '下書きイベント',
        description: '下書きイベントの説明',
        location: '福岡市中央区',
        start_datetime: Time.current + 1.day,
        end_datetime: Time.current + 2.days,
        event_category: event_category,
        status: :draft
      )
    end

    it 'upcoming は今後のイベントを返すこと' do
      expect(Event.upcoming).to include(upcoming_event)
      expect(Event.upcoming).not_to include(past_event)
    end

    it 'past は過去のイベントを返すこと' do
      expect(Event.past).to include(past_event)
      expect(Event.past).not_to include(upcoming_event)
    end

    it 'published は公開済みのイベントを返すこと' do
      expect(Event.published).to include(past_event, upcoming_event)
      expect(Event.published).not_to include(draft_event)
    end
  end
end
