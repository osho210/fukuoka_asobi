require 'rails_helper'

RSpec.describe PlayPlanImageProperty, type: :model do
  describe 'associations' do
    it { should belong_to(:play_plan) }
    it { should belong_to(:attachment).class_name('ActiveStorage::Attachment') }
  end

  describe 'validations' do
    let(:play_plan) { create(:play_plan) }
    let(:attachment) { create(:active_storage_attachment) }

    it { should validate_presence_of(:position) }
    it { should validate_numericality_of(:position).is_greater_than_or_equal_to(0) }

    it 'validates uniqueness of attachment_id scoped to play_plan_id' do
      create(:play_plan_image_property, play_plan: play_plan, attachment: attachment)
      duplicate = build(:play_plan_image_property, play_plan: play_plan, attachment: attachment)

      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:attachment_id]).to include('has already been taken')
    end
  end

  describe 'default values' do
    it 'sets default values correctly' do
      property = PlayPlanImageProperty.new
      expect(property.is_selected).to eq(false)
      expect(property.position).to eq(0)
    end
  end
end
