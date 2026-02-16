require 'rails_helper'

RSpec.describe LicensedAsset, type: :model do
  describe 'associations' do
    it { should belong_to(:spot) }
    it { should belong_to(:consent_agreement) }
  end

  describe 'validations' do
    it { should validate_presence_of(:asset_type) }
    it { should validate_inclusion_of(:asset_type).in_array(%w[UPLOAD URL]) }

    context 'when asset_type is URL' do
      it 'requires asset_url' do
        spot = create(:spot)
        consent_request = create(:consent_request, spot: spot, status: 'SENT')
        consent_agreement = create(:consent_agreement, consent_request: consent_request)
        
        asset = LicensedAsset.new(
          spot: spot,
          consent_agreement: consent_agreement,
          asset_type: 'URL'
        )
        
        expect(asset).not_to be_valid
        expect(asset.errors[:asset_url]).to be_present
      end

      it 'is valid with asset_url' do
        spot = create(:spot)
        consent_request = create(:consent_request, spot: spot, status: 'SENT')
        consent_agreement = create(:consent_agreement, consent_request: consent_request)
        
        asset = LicensedAsset.new(
          spot: spot,
          consent_agreement: consent_agreement,
          asset_type: 'URL',
          asset_url: 'https://example.com/image.jpg'
        )
        
        expect(asset).to be_valid
      end
    end
  end

  describe 'default values' do
    it 'sets usable to true by default' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, status: 'SENT')
      consent_agreement = create(:consent_agreement, consent_request: consent_request)
      
      asset = LicensedAsset.create!(
        spot: spot,
        consent_agreement: consent_agreement,
        asset_type: 'URL',
        asset_url: 'https://example.com/image.jpg'
      )
      
      expect(asset.usable).to be true
    end
  end

  describe '#disable!' do
    it 'sets usable to false' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, status: 'SENT')
      consent_agreement = create(:consent_agreement, consent_request: consent_request)
      asset = create(:licensed_asset, 
        spot: spot,
        consent_agreement: consent_agreement,
        usable: true
      )
      
      asset.disable!
      expect(asset.reload.usable).to be false
    end
  end

  describe '#enable!' do
    it 'sets usable to true' do
      spot = create(:spot)
      consent_request = create(:consent_request, spot: spot, status: 'SENT')
      consent_agreement = create(:consent_agreement, consent_request: consent_request)
      asset = create(:licensed_asset,
        spot: spot,
        consent_agreement: consent_agreement,
        usable: false
      )
      
      asset.enable!
      expect(asset.reload.usable).to be true
    end
  end

  describe '#image_url' do
    context 'when asset_type is URL' do
      it 'returns asset_url' do
        spot = create(:spot)
        consent_request = create(:consent_request, spot: spot, status: 'SENT')
        consent_agreement = create(:consent_agreement, consent_request: consent_request)
        asset = create(:licensed_asset,
          spot: spot,
          consent_agreement: consent_agreement,
          asset_type: 'URL',
          asset_url: 'https://example.com/image.jpg'
        )
        
        expect(asset.image_url).to eq('https://example.com/image.jpg')
      end
    end

    context 'when asset_type is UPLOAD' do
      it 'returns nil if no file attached' do
        spot = create(:spot)
        consent_request = create(:consent_request, spot: spot, status: 'SENT')
        consent_agreement = create(:consent_agreement, consent_request: consent_request)
        asset = LicensedAsset.new(
          spot: spot,
          consent_agreement: consent_agreement,
          asset_type: 'UPLOAD'
        )
        
        expect(asset.image_url).to be_nil
      end
    end
  end

  describe 'scopes' do
    let(:spot) { create(:spot) }
    let(:consent_request) { create(:consent_request, spot: spot, status: 'SENT') }
    let(:consent_agreement) { create(:consent_agreement, consent_request: consent_request) }

    describe '.usable' do
      it 'returns only usable assets' do
        usable1 = create(:licensed_asset, spot: spot, consent_agreement: consent_agreement, usable: true)
        usable2 = create(:licensed_asset, spot: spot, consent_agreement: consent_agreement, usable: true)
        disabled = create(:licensed_asset, spot: spot, consent_agreement: consent_agreement, usable: false)
        
        expect(LicensedAsset.usable).to contain_exactly(usable1, usable2)
      end
    end

    describe '.for_spot' do
      it 'returns assets for specified spot' do
        spot2 = create(:spot)
        asset1 = create(:licensed_asset, spot: spot, consent_agreement: consent_agreement)
        
        consent_request2 = create(:consent_request, spot: spot2, status: 'SENT')
        consent_agreement2 = create(:consent_agreement, consent_request: consent_request2)
        asset2 = create(:licensed_asset, spot: spot2, consent_agreement: consent_agreement2)
        
        expect(LicensedAsset.for_spot(spot.id)).to contain_exactly(asset1)
      end
    end
  end
end
