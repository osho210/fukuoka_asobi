require 'rails_helper'

RSpec.describe PlayPlan, type: :model do
  describe 'associations' do
    it { should belong_to(:user).optional }
    it { should have_many(:plan_details).dependent(:destroy) }
    it { should have_many(:play_plan_recommended_fors).dependent(:destroy) }
    it { should have_many(:recommended_fors).through(:play_plan_recommended_fors) }
    it { should have_many(:bookmarks).dependent(:destroy) }
    it { should have_many(:favorites).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:plan_name) }
  end

  describe 'default values' do
    let(:plan) { PlayPlan.create!(plan_name: 'テストプラン') }

    it 'is_indexable のデフォルト値が false であること' do
      expect(plan.is_indexable).to eq(false)
    end

    it 'status のデフォルト値が draft であること' do
      expect(plan.status).to eq('draft')
    end

    it 'trip_type のデフォルト値が day_trip であること' do
      expect(plan.trip_type).to eq('day_trip')
    end

    it 'is_recommended のデフォルト値が false であること' do
      expect(plan.is_recommended).to eq(false)
    end
  end
end
