require 'rails_helper'

RSpec.describe ConsentRequest, type: :model do
  describe 'associations' do
    it { should belong_to(:spot) }
    it { should have_one(:consent_agreement).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:consenter_type) }
    it { should validate_inclusion_of(:consenter_type).in_array(%w[STORE INSTAGRAM_USER]) }
    it { should validate_presence_of(:consenter_display_name) }
    it { should validate_presence_of(:status) }
    it { should validate_inclusion_of(:status).in_array(%w[DRAFT SENT APPROVED REJECTED REVOKED EXPIRED]) }
    it { should validate_presence_of(:token) }
  end

  describe 'token generation' do
    it 'generates a token on create' do
      spot = create(:spot)
      consent_request = ConsentRequest.new(
        spot: spot,
        consenter_type: 'STORE',
        consenter_display_name: '店長 田中'
      )
      
      expect(consent_request.token).to be_nil
      consent_request.save!
      expect(consent_request.token).to be_present
      expect(consent_request.token.length).to be > 20
    end

    it 'ensures token uniqueness' do
      spot = create(:spot)
      consent1 = create(:consent_request, spot: spot)
      consent2 = create(:consent_request, spot: spot)
      
      expect(consent1.token).not_to eq(consent2.token)
    end
  end

  describe 'default values' do
    it 'sets default status to DRAFT' do
      spot = create(:spot)
      consent_request = ConsentRequest.create!(
        spot: spot,
        consenter_type: 'STORE',
        consenter_display_name: '店長 田中'
      )
      
      expect(consent_request.status).to eq('DRAFT')
    end

    it 'sets default expires_at to 30 days from now' do
      spot = create(:spot)
      consent_request = ConsentRequest.create!(
        spot: spot,
        consenter_type: 'STORE',
        consenter_display_name: '店長 田中'
      )
      
      expect(consent_request.expires_at).to be_within(1.minute).of(30.days.from_now)
    end
  end

  describe '#expired?' do
    it 'returns true if expires_at is in the past' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, expires_at: 1.day.ago)
      
      expect(consent_request.expired?).to be true
    end

    it 'returns false if expires_at is in the future' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, expires_at: 1.day.from_now)
      
      expect(consent_request.expired?).to be false
    end

    it 'returns false if expires_at is nil' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, expires_at: nil)
      
      expect(consent_request.expired?).to be false
    end
  end

  describe '#can_be_approved?' do
    it 'returns true for SENT status and not expired' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, status: 'SENT', expires_at: 1.day.from_now)
      
      expect(consent_request.can_be_approved?).to be true
    end

    it 'returns false for APPROVED status' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, status: 'APPROVED')
      
      expect(consent_request.can_be_approved?).to be false
    end

    it 'returns false if expired' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, status: 'SENT', expires_at: 1.day.ago)
      
      expect(consent_request.can_be_approved?).to be false
    end
  end

  describe '#approve!' do
    it 'changes status to APPROVED' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, status: 'SENT')
      
      consent_request.approve!
      expect(consent_request.reload.status).to eq('APPROVED')
    end
  end

  describe '#revoke!' do
    it 'changes status to REVOKED' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, status: 'APPROVED')
      
      consent_request.revoke!
      expect(consent_request.reload.status).to eq('REVOKED')
    end
  end

  describe 'scopes' do
    let(:spot) { create(:spot) }

    describe '.active' do
      it 'returns only DRAFT and SENT requests' do
        draft = create(:consent_request, spot: spot, status: 'DRAFT')
        sent = create(:consent_request, spot: spot, status: 'SENT')
        approved = create(:consent_request, spot: spot, status: 'APPROVED')
        
        expect(ConsentRequest.active).to contain_exactly(draft, sent)
      end
    end

    describe '.approved' do
      it 'returns only APPROVED requests' do
        draft = create(:consent_request, spot: spot, status: 'DRAFT')
        approved1 = create(:consent_request, spot: spot, status: 'APPROVED')
        approved2 = create(:consent_request, spot: spot, status: 'APPROVED')
        
        expect(ConsentRequest.approved).to contain_exactly(approved1, approved2)
      end
    end

    describe '.for_spot' do
      it 'returns requests for specified spot' do
        spot2 = create(:spot)
        request1 = create(:consent_request, spot: spot)
        request2 = create(:consent_request, spot: spot2)
        
        expect(ConsentRequest.for_spot(spot.id)).to contain_exactly(request1)
      end
    end
  end
end
