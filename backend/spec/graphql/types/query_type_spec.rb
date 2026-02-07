# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::QueryType do
  describe 'spots query' do
    let(:district) { create(:district) }
    let!(:public_spot1) { create(:spot, district: district, spot_name: '公開スポット1', spot_type: 'STORE', is_public: true) }
    let!(:public_spot2) { create(:spot, district: district, spot_name: '公開スポット2', spot_type: 'STORE', is_public: true) }
    let!(:private_spot) { create(:spot, district: district, spot_name: '非公開スポット', spot_type: 'STORE', is_public: false) }

    let(:query) do
      <<~GQL
        query {
          spots {
            id
            spotName
            isPublic
          }
        }
      GQL
    end

    it '公開されているスポットのみを返すこと' do
      result = BackendSchema.execute(query)
      spots_data = result.dig('data', 'spots')

      expect(spots_data).to be_an(Array)
      expect(spots_data.size).to eq(2)

      spot_ids = spots_data.map { |s| s['id'].to_i }
      expect(spot_ids).to include(public_spot1.id, public_spot2.id)
      expect(spot_ids).not_to include(private_spot.id)

      spots_data.each do |spot|
        expect(spot['isPublic']).to be true
      end
    end
  end
end
