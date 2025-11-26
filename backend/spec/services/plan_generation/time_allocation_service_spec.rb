# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PlanGeneration::TimeAllocationService, type: :service do
  describe '.calculate_stay_times' do
    context 'カフェの場合' do
      it '60分の滞在時間を返す' do
        category = create(:category, name: 'カフェ')
        spot = build(:spot)
        allow(spot).to receive(:categories).and_return([category])

        stay_times = described_class.send(:calculate_stay_times, [spot])
        expect(stay_times).to eq([60])
      end
    end

    context 'レストランの場合' do
      it '90分の滞在時間を返す' do
        category = create(:category, name: 'レストラン')
        spot = build(:spot)
        allow(spot).to receive(:categories).and_return([category])

        stay_times = described_class.send(:calculate_stay_times, [spot])
        expect(stay_times).to eq([90])
      end
    end

    context '居酒屋の場合' do
      it '120分の滞在時間を返す' do
        category = create(:category, name: '居酒屋')
        spot = build(:spot)
        allow(spot).to receive(:categories).and_return([category])

        stay_times = described_class.send(:calculate_stay_times, [spot])
        expect(stay_times).to eq([120])
      end
    end

    context '美術館の場合' do
      it '120分の滞在時間を返す' do
        category = create(:category, name: '美術館')
        spot = build(:spot)
        allow(spot).to receive(:categories).and_return([category])

        stay_times = described_class.send(:calculate_stay_times, [spot])
        expect(stay_times).to eq([120])
      end
    end

    context '公園の場合' do
      it '90分の滞在時間を返す' do
        category = create(:category, name: '公園')
        spot = build(:spot)
        allow(spot).to receive(:categories).and_return([category])

        stay_times = described_class.send(:calculate_stay_times, [spot])
        expect(stay_times).to eq([90])
      end
    end

    context 'ショッピングの場合' do
      it '120分の滞在時間を返す' do
        category = create(:category, name: 'ショッピング')
        spot = build(:spot)
        allow(spot).to receive(:categories).and_return([category])

        stay_times = described_class.send(:calculate_stay_times, [spot])
        expect(stay_times).to eq([120])
      end
    end

    context '温泉の場合' do
      it '120分の滞在時間を返す' do
        category = create(:category, name: '温泉')
        spot = build(:spot)
        allow(spot).to receive(:categories).and_return([category])

        stay_times = described_class.send(:calculate_stay_times, [spot])
        expect(stay_times).to eq([120])
      end
    end

    context '観光地の場合' do
      it '90分の滞在時間を返す' do
        category = create(:category, name: '観光地')
        spot = build(:spot)
        allow(spot).to receive(:categories).and_return([category])

        stay_times = described_class.send(:calculate_stay_times, [spot])
        expect(stay_times).to eq([90])
      end
    end

    context 'アクティビティの場合' do
      it '120分の滞在時間を返す' do
        category = create(:category, name: 'アクティビティ')
        spot = build(:spot)
        allow(spot).to receive(:categories).and_return([category])

        stay_times = described_class.send(:calculate_stay_times, [spot])
        expect(stay_times).to eq([120])
      end
    end

    context '体験の場合' do
      it '90分の滞在時間を返す' do
        category = create(:category, name: '体験')
        spot = build(:spot)
        allow(spot).to receive(:categories).and_return([category])

        stay_times = described_class.send(:calculate_stay_times, [spot])
        expect(stay_times).to eq([90])
      end
    end

    context '絶景の場合' do
      it '60分の滞在時間を返す' do
        category = create(:category, name: '絶景')
        spot = build(:spot)
        allow(spot).to receive(:categories).and_return([category])

        stay_times = described_class.send(:calculate_stay_times, [spot])
        expect(stay_times).to eq([60])
      end
    end

    context '道の駅の場合' do
      it '45分の滞在時間を返す' do
        category = create(:category, name: '道の駅')
        spot = build(:spot)
        allow(spot).to receive(:categories).and_return([category])

        stay_times = described_class.send(:calculate_stay_times, [spot])
        expect(stay_times).to eq([45])
      end
    end

    context '神社・寺の場合' do
      it '60分の滞在時間を返す' do
        category = create(:category, name: '神社・寺')
        spot = build(:spot)
        allow(spot).to receive(:categories).and_return([category])

        stay_times = described_class.send(:calculate_stay_times, [spot])
        expect(stay_times).to eq([60])
      end
    end

    context 'イベントの場合' do
      it '120分の滞在時間を返す' do
        category = create(:category, name: 'イベント')
        spot = build(:spot)
        allow(spot).to receive(:categories).and_return([category])

        stay_times = described_class.send(:calculate_stay_times, [spot])
        expect(stay_times).to eq([120])
      end
    end

    context 'その他の場合' do
      it '90分の滞在時間を返す' do
        category = create(:category, name: 'その他')
        spot = build(:spot)
        allow(spot).to receive(:categories).and_return([category])

        stay_times = described_class.send(:calculate_stay_times, [spot])
        expect(stay_times).to eq([90])
      end
    end

    context 'カテゴリーが設定されていない場合' do
      it 'デフォルトの90分を返す' do
        spot = build(:spot)
        allow(spot).to receive(:categories).and_return([])

        stay_times = described_class.send(:calculate_stay_times, [spot])
        expect(stay_times).to eq([90])
      end
    end

    context '複数のスポットがある場合' do
      it 'それぞれのカテゴリに応じた滞在時間を返す' do
        cafe_category = create(:category, name: 'カフェ')
        restaurant_category = create(:category, name: 'レストラン')

        spot1 = build(:spot)
        spot2 = build(:spot)
        allow(spot1).to receive(:categories).and_return([cafe_category])
        allow(spot2).to receive(:categories).and_return([restaurant_category])

        stay_times = described_class.send(:calculate_stay_times, [spot1, spot2])
        expect(stay_times).to eq([60, 90])
      end
    end
  end

  describe '.allocate' do
    let(:district) { create(:district) }
    let(:cafe_category) { create(:category, name: 'カフェ') }
    let(:restaurant_category) { create(:category, name: 'レストラン') }

    it '各スポットに滞在時間と移動時間を割り当てる' do
      spot1 = create(:spot, district: district, categories: [cafe_category])
      spot2 = create(:spot, district: district, categories: [restaurant_category])

      result = described_class.allocate([spot1, spot2], 300)

      expect(result.length).to eq(2)
      expect(result[0][:spot]).to eq(spot1)
      expect(result[0][:stay_time]).to eq(60)  # カフェ
      expect(result[0][:travel_time]).to be_present
      expect(result[1][:spot]).to eq(spot2)
      expect(result[1][:stay_time]).to eq(90)  # レストラン
      expect(result[1][:travel_time]).to be_nil  # 最後のスポット
    end

    it '利用可能時間を超える場合は滞在時間を調整する' do
      spot1 = create(:spot, district: district, categories: [cafe_category])
      spot2 = create(:spot, district: district, categories: [restaurant_category])

      # 合計滞在時間150分に対して100分しか利用可能時間がない場合
      result = described_class.allocate([spot1, spot2], 100)

      # 移動時間を考慮した調整が行われる
      total_stay_time = result[0][:stay_time] + result[1][:stay_time]
      total_travel_time = result[0][:travel_time]
      total_time = total_stay_time + total_travel_time

      expect(total_time).to be <= 100
    end
  end

  describe '.adjust_stay_times' do
    it '総所要時間が利用可能時間以下の場合は調整しない' do
      stay_times = [60, 90]
      travel_times = [20]
      total_available_time = 200
      total_time = 170

      adjusted = described_class.send(:adjust_stay_times, stay_times, travel_times, total_available_time, total_time)
      expect(adjusted).to eq([60, 90])
    end

    it '総所要時間が利用可能時間を超える場合は比例配分で調整する' do
      stay_times = [60, 90]  # 合計150分
      travel_times = [20]
      total_available_time = 100
      total_time = 170

      adjusted = described_class.send(:adjust_stay_times, stay_times, travel_times, total_available_time, total_time)

      # 利用可能な滞在時間 = 100 - 20 = 80分
      # 調整比率 = 80 / 150 = 0.533...
      # spot1: 60 * 0.533... = 32分
      # spot2: 90 * 0.533... = 48分
      expect(adjusted[0]).to eq(32)
      expect(adjusted[1]).to eq(48)
    end

    it '移動時間だけで利用可能時間を超える場合は調整しない' do
      stay_times = [60, 90]
      travel_times = [120]  # 移動時間だけで120分
      total_available_time = 100
      total_time = 270

      adjusted = described_class.send(:adjust_stay_times, stay_times, travel_times, total_available_time, total_time)
      expect(adjusted).to eq([60, 90])
    end
  end
end
