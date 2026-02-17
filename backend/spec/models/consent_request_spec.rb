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

  describe 'トークン生成' do
    it '作成時にトークンが生成されること' do
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

    it 'トークンがユニークであること' do
      spot = create(:spot)
      consent1 = create(:consent_request, spot: spot)
      consent2 = create(:consent_request, spot: spot)
      
      expect(consent1.token).not_to eq(consent2.token)
    end
  end

  describe 'デフォルト値' do
    it 'デフォルトステータスがDRAFTであること' do
      spot = create(:spot)
      consent_request = ConsentRequest.create!(
        spot: spot,
        consenter_type: 'STORE',
        consenter_display_name: '店長 田中'
      )
      
      expect(consent_request.status).to eq('DRAFT')
    end

    it 'デフォルトの有効期限が30日後であること' do
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
    context '有効期限が過去の場合' do
      it 'trueを返すこと' do
        spot = create(:spot)
        consent_request = create(:consent_request, spot: spot, expires_at: 1.day.ago)
        
        expect(consent_request.expired?).to be true
      end
    end

    context '有効期限が未来の場合' do
      it 'falseを返すこと' do
        spot = create(:spot)
        consent_request = create(:consent_request, spot: spot, expires_at: 1.day.from_now)
        
        expect(consent_request.expired?).to be false
      end
    end

    context '有効期限がnilの場合' do
      it 'falseを返すこと' do
        spot = create(:spot)
        consent_request = create(:consent_request, spot: spot, expires_at: nil)
        
        expect(consent_request.expired?).to be false
      end
    end
  end

  describe '#can_be_approved?' do
    context 'ステータスがSENTで有効期限内の場合' do
      it 'trueを返すこと' do
        spot = create(:spot)
        consent_request = create(:consent_request, spot: spot, status: 'SENT', expires_at: 1.day.from_now)
        
        expect(consent_request.can_be_approved?).to be true
      end
    end

    context 'ステータスがAPPROVEDの場合' do
      it 'falseを返すこと' do
        spot = create(:spot)
        consent_request = create(:consent_request, spot: spot, status: 'APPROVED')
        
        expect(consent_request.can_be_approved?).to be false
      end
    end

    context '有効期限が切れている場合' do
      it 'falseを返すこと' do
        spot = create(:spot)
        consent_request = create(:consent_request, spot: spot, status: 'SENT', expires_at: 1.day.ago)
        
        expect(consent_request.can_be_approved?).to be false
      end
    end
  end

  describe '#approve!' do
    it 'ステータスがAPPROVEDに変更されること' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, status: 'SENT')
      
      consent_request.approve!
      expect(consent_request.reload.status).to eq('APPROVED')
    end
  end

  describe '#revoke!' do
    it 'ステータスがREVOKEDに変更されること' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, status: 'APPROVED')
      
      consent_request.revoke!
      expect(consent_request.reload.status).to eq('REVOKED')
    end
  end

  describe 'スコープ' do
    let(:spot) { create(:spot) }

    describe '.active' do
      it 'DRAFTとSENTのみを返すこと' do
        draft = create(:consent_request, spot: spot, status: 'DRAFT')
        sent = create(:consent_request, spot: spot, status: 'SENT')
        approved = create(:consent_request, spot: spot, status: 'APPROVED')
        
        expect(ConsentRequest.active).to contain_exactly(draft, sent)
      end
    end

    describe '.approved' do
      it 'APPROVEDのみを返すこと' do
        draft = create(:consent_request, spot: spot, status: 'DRAFT')
        approved1 = create(:consent_request, spot: spot, status: 'APPROVED')
        approved2 = create(:consent_request, spot: spot, status: 'APPROVED')
        
        expect(ConsentRequest.approved).to contain_exactly(approved1, approved2)
      end
    end

    describe '.for_spot' do
      it '指定された店舗の依頼のみを返すこと' do
        spot2 = create(:spot)
        request1 = create(:consent_request, spot: spot)
        request2 = create(:consent_request, spot: spot2)
        
        expect(ConsentRequest.for_spot(spot.id)).to contain_exactly(request1)
      end
    end
  end
end
