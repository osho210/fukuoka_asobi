require 'rails_helper'

RSpec.describe Types::SpotType do
  let(:context) { {} }
  let(:variables) { {} }

  # BackendSchemaはGraphQLスキーマのクラス名に合わせて変更してください
  let(:schema) { BackendSchema }

  # クエリの実行ヘルパーメソッド
  def execute_query(query, context: {}, variables: {}, operation_name: nil)
    schema.execute(
      query,
      context: context,
      variables: variables,
      operation_name: operation_name
    )
  end

  describe 'fields' do
    let(:district) { create(:district) }
    let(:spot) { create(:spot, district: district, spot_name: 'テストスポット', spot_type: 'STORE') }
    let(:query) do
      <<~GRAPHQL
        query($id: ID!) {
          spot(id: $id) {
            id
            spotName
            openingHourList {
              dayOfWeek
              businessHour
            }
          }
        }
      GRAPHQL
    end

    context '営業時間が登録されている場合' do
      before do
        create(:opening_hour,
          spot: spot,
          day_of_week: '月',
          open_time: Time.zone.parse('10:00'),
          close_time: Time.zone.parse('18:00')
        )
        create(:opening_hour,
          spot: spot,
          day_of_week: '火',
          open_time: Time.zone.parse('11:00'),
          close_time: Time.zone.parse('19:00')
        )
      end

      it 'opening_hour_listフィールドが正しい値を返すこと' do
        result = execute_query(query, variables: { id: spot.id })

        # エラーがないことを確認
        expect(result['errors']).to be_nil

        # データが正しく取得できていることを確認
        spot_data = result['data']['spot']
        expect(spot_data).not_to be_nil
        expect(spot_data['id']).to eq(spot.id.to_s)
        expect(spot_data['spotName']).to eq(spot.spot_name)

        # opening_hour_listの検証
        opening_hours = spot_data['openingHourList']
        expect(opening_hours).to be_an(Array)
        expect(opening_hours.size).to eq(2)

        expect(opening_hours[0]['dayOfWeek']).to eq('月')
        expect(opening_hours[0]['businessHour']).to eq('10:00 ~ 18:00')

        expect(opening_hours[1]['dayOfWeek']).to eq('火')
        expect(opening_hours[1]['businessHour']).to eq('11:00 ~ 19:00')
      end
    end

    context '営業時間が登録されていない場合' do
      it 'opening_hour_listフィールドが空の配列を返すこと' do
        result = execute_query(query, variables: { id: spot.id })

        # エラーがないことを確認
        expect(result['errors']).to be_nil

        # データが正しく取得できていることを確認
        spot_data = result['data']['spot']
        expect(spot_data).not_to be_nil

        # opening_hour_listの検証
        opening_hours = spot_data['openingHourList']
        expect(opening_hours).to eq([])
      end
    end
  end
end
