require 'rails_helper'

RSpec.describe ConsentAgreement, type: :model do
  describe 'associations' do
    it { should belong_to(:consent_request) }
    it { should have_many(:licensed_assets).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:agreed_at) }
    it { should validate_presence_of(:agreement_version) }
    it { should validate_presence_of(:agreement_snapshot_json) }
    it { should validate_presence_of(:signer_name) }
    it { should validate_inclusion_of(:rights_confirmed).in_array([true]) }
  end

  describe 'default values' do
    let(:spot) { create(:spot) }
    let(:consent_request) { create(:consent_request, spot: spot, status: 'SENT') }

    it 'sets agreed_at to current time' do
      agreement = ConsentAgreement.create!(
        consent_request: consent_request,
        signer_name: 'テスト太郎',
        rights_confirmed: true
      )
      
      expect(agreement.agreed_at).to be_within(1.second).of(Time.current)
    end

    it 'sets default agreement_version to v1.0' do
      agreement = ConsentAgreement.create!(
        consent_request: consent_request,
        signer_name: 'テスト太郎',
        rights_confirmed: true
      )
      
      expect(agreement.agreement_version).to eq('v1.0')
    end

    it 'generates agreement_snapshot_json' do
      agreement = ConsentAgreement.create!(
        consent_request: consent_request,
        signer_name: 'テスト太郎',
        rights_confirmed: true
      )
      
      expect(agreement.agreement_snapshot_json).to be_present
      snapshot = JSON.parse(agreement.agreement_snapshot_json)
      expect(snapshot['media']).to include('Webメディア')
      expect(snapshot['media']).to include('Instagram（あなたのアカウント）')
      expect(snapshot['usage_scope']).to include('投稿')
      expect(snapshot['usage_scope']).to include('ストーリーズ')
    end
  end

  describe 'after_create callback' do
    it 'updates consent_request status to APPROVED' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, status: 'SENT')
      
      expect(consent_request.status).to eq('SENT')
      
      ConsentAgreement.create!(
        consent_request: consent_request,
        signer_name: 'テスト太郎',
        rights_confirmed: true
      )
      
      expect(consent_request.reload.status).to eq('APPROVED')
    end
  end

  describe '#agreement_snapshot' do
    it 'returns parsed JSON' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, status: 'SENT')
      agreement = ConsentAgreement.create!(
        consent_request: consent_request,
        signer_name: 'テスト太郎',
        rights_confirmed: true
      )
      
      snapshot = agreement.agreement_snapshot
      expect(snapshot).to be_a(Hash)
      expect(snapshot['media']).to be_present
      expect(snapshot['usage_scope']).to be_present
    end

    it 'returns empty hash for invalid JSON' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, status: 'SENT')
      agreement = ConsentAgreement.create!(
        consent_request: consent_request,
        signer_name: 'テスト太郎',
        rights_confirmed: true
      )
      
      agreement.update_column(:agreement_snapshot_json, 'invalid json')
      expect(agreement.agreement_snapshot).to eq({})
    end
  end

  describe 'with photographer info' do
    it 'includes photographer_name in snapshot' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, status: 'SENT')
      agreement = ConsentAgreement.create!(
        consent_request: consent_request,
        signer_name: 'テスト太郎',
        photographer_name: '山田花子',
        tag_photographer_requested: true,
        tag_accounts_text: '@yamada_hanako',
        rights_confirmed: true
      )
      
      snapshot = agreement.agreement_snapshot
      expect(snapshot['credits']['photographer_name']).to be true
      expect(snapshot['credits']['tag_photographer']).to be true
    end
  end
end
