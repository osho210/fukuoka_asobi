class AddSlugToExistingDistricts < ActiveRecord::Migration[8.0]
  def up
    # 福岡市の区に "fukuoka_city" slugを設定
    fukuoka_city_districts = [
      '博多区', '中央区', '東区', '南区', '西区', '城南区', '早良区'
    ]

    fukuoka_city_districts.each do |district_name|
      District.find_by(district_name: district_name)&.update(slug: 'fukuoka_city')
    end

    # その他の主要エリアにもslugを設定
    slug_mappings = {
      '糸島市' => 'itoshima',
      '北九州' => 'kitakyushu',
      '久留米' => 'kurume',
      '大牟田' => 'omuta',
      '飯塚' => 'iizuka'
    }

    slug_mappings.each do |district_name, slug|
      District.find_by(district_name: district_name)&.update(slug: slug)
    end
  end

  def down
    # ロールバック時はslugをnullに戻す
    District.update_all(slug: nil)
  end
end
