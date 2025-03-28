class UpdateAreasWithSlug < ActiveRecord::Migration[8.0]
  def up
    # フロントエンドのAreaMapコンポーネントで使用されているエリアIDに合わせてslugを設定
    area_slug_mapping = {
      '糸島' => 'itoshima',
      '糟屋郡' => 'kasuya',
      '宗像' => 'munakata',
      '北九州市' => 'kitakyushu',
      '朝倉' => 'asakura',
      'うきは' => 'ukiha',
      '八女' => 'yame',
      '大牟田' => 'omuta',
      '柳川' => 'yanagawa',
      '久留米' => 'kurume',
      '太宰府・大野城' => 'dazaifu_onojo',
      '福岡市' => 'fukuoka_city'
    }

    # 各エリアにslugを設定
    area_slug_mapping.each do |area_name, slug|
      # 完全一致または部分一致でエリアを検索
      areas = Area.where('area_name = ? OR area_name LIKE ?', area_name, "%#{area_name}%")
      areas.each do |area|
        area.update_column(:slug, slug)
        puts "Updated area: #{area.area_name} with slug: #{slug}"
      end
    end
  end

  def down
    # slugをnilに戻す
    Area.update_all(slug: nil)
  end
end
