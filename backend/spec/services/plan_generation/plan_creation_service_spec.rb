# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PlanGeneration::PlanCreationService, type: :service do
  describe '.calculate_spot_budget' do
    context 'when price_range_start_amount and price_range_end_amount are present' do
      it 'returns the average of start and end amounts' do
        spot = build(:spot, price_range_start_amount: 1000, price_range_end_amount: 2000)
        budget = described_class.send(:calculate_spot_budget, spot)
        expect(budget).to eq(1500)
      end

      it 'rounds the average to the nearest integer' do
        spot = build(:spot, price_range_start_amount: 1000, price_range_end_amount: 2001)
        budget = described_class.send(:calculate_spot_budget, spot)
        expect(budget).to eq(1501)
      end
    end

    context 'when price_range_start_amount is nil' do
      it 'falls back to BUDGET_VALUES based on budget_range' do
        spot = build(:spot, price_range_start_amount: nil, price_range_end_amount: 2000, budget_range: 'CHEAP')
        budget = described_class.send(:calculate_spot_budget, spot)
        expect(budget).to eq(3000)
      end
    end

    context 'when price_range_end_amount is nil' do
      it 'falls back to BUDGET_VALUES based on budget_range' do
        spot = build(:spot, price_range_start_amount: 1000, price_range_end_amount: nil, budget_range: 'AVERAGE')
        budget = described_class.send(:calculate_spot_budget, spot)
        expect(budget).to eq(8000)
      end
    end

    context 'when both price ranges are nil' do
      it 'returns CHEAP budget for CHEAP budget_range' do
        spot = build(:spot, price_range_start_amount: nil, price_range_end_amount: nil, budget_range: 'CHEAP')
        budget = described_class.send(:calculate_spot_budget, spot)
        expect(budget).to eq(3000)
      end

      it 'returns AVERAGE budget for AVERAGE budget_range' do
        spot = build(:spot, price_range_start_amount: nil, price_range_end_amount: nil, budget_range: 'AVERAGE')
        budget = described_class.send(:calculate_spot_budget, spot)
        expect(budget).to eq(8000)
      end

      it 'returns EXPENSIVE budget for EXPENSIVE budget_range' do
        spot = build(:spot, price_range_start_amount: nil, price_range_end_amount: nil, budget_range: 'EXPENSIVE')
        budget = described_class.send(:calculate_spot_budget, spot)
        expect(budget).to eq(15000)
      end

      it 'returns AVERAGE budget when budget_range is nil' do
        spot = build(:spot, price_range_start_amount: nil, price_range_end_amount: nil, budget_range: nil)
        budget = described_class.send(:calculate_spot_budget, spot)
        expect(budget).to eq(8000)
      end
    end
  end

  describe '.calculate_total_budget' do
    it 'sums up budgets of all spots using calculate_spot_budget' do
      spot1 = build(:spot, price_range_start_amount: 1000, price_range_end_amount: 2000)
      spot2 = build(:spot, price_range_start_amount: 3000, price_range_end_amount: 5000)
      spot3 = build(:spot, price_range_start_amount: nil, price_range_end_amount: nil, budget_range: 'CHEAP')

      route_with_times = [
        { spot: spot1, stay_time: 60 },
        { spot: spot2, stay_time: 90 },
        { spot: spot3, stay_time: 45 }
      ]

      total_budget = described_class.send(:calculate_total_budget, route_with_times)
      # spot1: (1000 + 2000) / 2 = 1500
      # spot2: (3000 + 5000) / 2 = 4000
      # spot3: 3000 (CHEAP fallback)
      # Total: 1500 + 4000 + 3000 = 8500
      expect(total_budget).to eq(8500)
    end
  end

  describe '.create' do
    let(:district) { create(:district, district_name: 'テスト地区', slug: 'test-district') }
    let(:spot1) { create(:spot, district: district, spot_name: 'スポット1', price_range_start_amount: 1000, price_range_end_amount: 2000) }
    let(:spot2) { create(:spot, district: district, spot_name: 'スポット2', price_range_start_amount: 3000, price_range_end_amount: 5000) }
    let(:user) { create(:user) }

    let(:route_with_times) do
      [
        { spot: spot1, stay_time: 60, travel_time: 15, travel_method: 'walk' },
        { spot: spot2, stay_time: 90, travel_time: nil, travel_method: nil }
      ]
    end

    let(:date) { Date.today }
    let(:start_time) { Time.zone.parse("#{date} 10:00:00") }
    let(:districts) { [district.slug] }

    it 'creates a PlayPlan with correct total_budget based on price ranges' do
      play_plan = described_class.create(
        route_with_times: route_with_times,
        districts: districts,
        date: date,
        start_time: start_time,
        user: user
      )

      # spot1: 1500, spot2: 4000
      # Total: 5500
      expect(play_plan.total_budget).to eq(5500)
    end

    it 'creates PlanDetails with correct budgets' do
      play_plan = described_class.create(
        route_with_times: route_with_times,
        districts: districts,
        date: date,
        start_time: start_time,
        user: user
      )

      plan_details = play_plan.plan_details.order(:step_number)
      expect(plan_details.first.budget).to eq(1500)  # spot1
      expect(plan_details.second.budget).to eq(4000) # spot2
    end

    it 'creates a PlayPlan with fallback budget when price ranges are not set' do
      spot3 = create(:spot, district: district, spot_name: 'スポット3',
                     price_range_start_amount: nil, price_range_end_amount: nil,
                     budget_range: 'CHEAP')

      route = [
        { spot: spot3, stay_time: 60, travel_time: nil, travel_method: nil }
      ]

      play_plan = described_class.create(
        route_with_times: route,
        districts: districts,
        date: date,
        start_time: start_time,
        user: user
      )

      expect(play_plan.total_budget).to eq(3000) # CHEAP fallback
      expect(play_plan.plan_details.first.budget).to eq(3000)
    end
  end
end
