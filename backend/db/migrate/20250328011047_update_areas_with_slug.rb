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


UPDATE fukuoka_asobi_development.areas
SET area_name='博多駅周辺', district_id=1, slug='hakata', created_at='2025-03-22 06:24:45.110893', updated_at='2025-03-22 06:24:45.110893'
WHERE id=1;
UPDATE fukuoka_asobi_development.areas
SET area_name='祇園', district_id=1, slug='gion', created_at='2025-03-22 06:24:45.133180', updated_at='2025-03-22 06:24:45.133180'
WHERE id=2;
UPDATE fukuoka_asobi_development.areas
SET area_name='中洲', district_id=1, slug='nakasu', created_at='2025-03-22 06:24:45.143407', updated_at='2025-03-22 06:24:45.143407'
WHERE id=3;
UPDATE fukuoka_asobi_development.areas
SET area_name='冷泉', district_id=1, slug='reisen', created_at='2025-03-22 06:24:45.156935', updated_at='2025-03-22 06:24:45.156935'
WHERE id=4;
UPDATE fukuoka_asobi_development.areas
SET area_name='吉塚', district_id=1, slug='yoshizuka', created_at='2025-03-22 06:24:45.185868', updated_at='2025-03-22 06:24:45.185868'
WHERE id=5
UPDATE fukuoka_asobi_development.areas
SET area_name='東比恵', district_id=1, slug='higashihie', created_at='2025-03-22 06:24:45.196775', updated_at='2025-03-22 06:24:45.196775'
WHERE id=6;
UPDATE fukuoka_asobi_development.areas
SET area_name='千代', district_id=1, slug='tiyo', created_at='2025-03-22 06:24:45.196775', updated_at='2025-03-22 06:24:45.196775'
WHERE id=7;
UPDATE fukuoka_asobi_development.areas
SET area_name='天神', district_id=2, slug='tenjin', created_at='2025-03-22 06:24:45.224921', updated_at='2025-03-22 06:24:45.224921'
WHERE id=8;
UPDATE fukuoka_asobi_development.areas
SET area_name='大名', district_id=2, slug='daimyo', created_at='2025-03-22 06:24:45.238343', updated_at='2025-03-22 06:24:45.238343'
WHERE id=9;
UPDATE fukuoka_asobi_development.areas
SET area_name='今泉', district_id=2, slug='imaizumi', created_at='2025-03-22 06:24:45.246474', updated_at='2025-03-22 06:24:45.246474'
WHERE id=10;
UPDATE fukuoka_asobi_development.areas
SET area_name='赤坂', district_id=2, slug='akasaka', created_at='2025-03-22 06:24:45.253594', updated_at='2025-03-22 06:24:45.253594'
WHERE id=11;
UPDATE fukuoka_asobi_development.areas
SET area_name='薬院', district_id=2, slug='yakuin', created_at='2025-03-22 06:24:45.260765', updated_at='2025-03-22 06:24:45.260765'
WHERE id=12;
UPDATE fukuoka_asobi_development.areas
SET area_name='平尾', district_id=2, slug='hirao', created_at='2025-03-22 06:24:45.267545', updated_at='2025-03-22 06:24:45.267545'
WHERE id=13;
UPDATE fukuoka_asobi_development.areas
SET area_name='六本松', district_id=2, slug='ropponmatsu', created_at='2025-03-22 06:24:45.273880', updated_at='2025-03-22 06:24:45.273880'
WHERE id=14;
UPDATE fukuoka_asobi_development.areas
SET area_name='桜坂', district_id=2, slug='sakurazaka', created_at='2025-03-22 06:24:45.283657', updated_at='2025-03-22 06:24:45.283657'
WHERE id=15;
UPDATE fukuoka_asobi_development.areas
SET area_name='大濠', district_id=2, slug='oohori', created_at='2025-03-22 06:24:45.290921', updated_at='2025-03-22 06:24:45.290921'
WHERE id=16;
UPDATE fukuoka_asobi_development.areas
SET area_name='舞鶴', district_id=2, slug='maizuru', created_at='2025-03-22 06:24:45.298100', updated_at='2025-03-22 06:24:45.298100'
WHERE id=17;
UPDATE fukuoka_asobi_development.areas
SET area_name='箱崎', district_id=3, slug='hakozaki', created_at='2025-03-22 06:24:45.305976', updated_at='2025-03-22 06:24:45.305976'
WHERE id=18;
UPDATE fukuoka_asobi_development.areas
SET area_name='香椎', district_id=3, slug='kasi', created_at='2025-03-22 06:24:45.316127', updated_at='2025-03-22 06:24:45.316127'
WHERE id=19;
UPDATE fukuoka_asobi_development.areas
SET area_name='和白', district_id=3, slug='wajiro', created_at='2025-03-22 06:24:45.323700', updated_at='2025-03-22 06:24:45.323700'
WHERE id=20;
UPDATE fukuoka_asobi_development.areas
SET area_name='名島', district_id=3, slug='najima', created_at='2025-03-22 06:24:45.330440', updated_at='2025-03-22 06:24:45.330440'
WHERE id=21;
UPDATE fukuoka_asobi_development.areas
SET area_name='千早', district_id=3, slug='chihaya', created_at='2025-03-22 06:24:45.339847', updated_at='2025-03-22 06:24:45.339847'
WHERE id=22;
UPDATE fukuoka_asobi_development.areas
SET area_name='大橋', district_id=4, slug='ohashi', created_at='2025-03-22 06:24:45.354362', updated_at='2025-03-22 06:24:45.354362'
WHERE id=23;
UPDATE fukuoka_asobi_development.areas
SET area_name='高宮', district_id=4, slug='takamiya', created_at='2025-03-22 06:24:45.360504', updated_at='2025-03-22 06:24:45.360504'
WHERE id=24;
UPDATE fukuoka_asobi_development.areas
SET area_name='野多目', district_id=4, slug='notame', created_at='2025-03-22 06:24:45.368219', updated_at='2025-03-22 06:24:45.368219'
WHERE id=25;
UPDATE fukuoka_asobi_development.areas
SET area_name='塩原', district_id=4, slug='shiobaru', created_at='2025-03-22 06:24:45.375182', updated_at='2025-03-22 06:24:45.375182'
WHERE id=26;
UPDATE fukuoka_asobi_development.areas
SET area_name='長住', district_id=4, slug='nagazumi', created_at='2025-03-22 06:24:45.381981', updated_at='2025-03-22 06:24:45.381981'
WHERE id=27;
UPDATE fukuoka_asobi_development.areas
SET area_name='姪浜', district_id=5, slug='mainohama', created_at='2025-03-22 06:24:45.389450', updated_at='2025-03-22 06:24:45.389450'
WHERE id=28;
UPDATE fukuoka_asobi_development.areas
SET area_name='西新', district_id=5, slug='nishijin', created_at='2025-03-22 06:24:45.397865', updated_at='2025-03-22 06:24:45.397865'
WHERE id=29;
UPDATE fukuoka_asobi_development.areas
SET area_name='室見', district_id=5, slug='muromi', created_at='2025-03-22 06:24:45.412405', updated_at='2025-03-22 06:24:45.412405'
WHERE id=30;
UPDATE fukuoka_asobi_development.areas
SET area_name='今宿', district_id=5, slug='imayado', created_at='2025-03-22 06:24:45.420195', updated_at='2025-03-22 06:24:45.420195'
WHERE id=31;
UPDATE fukuoka_asobi_development.areas
SET area_name='糸島', district_id=5, slug='itoshima', created_at='2025-03-22 06:24:45.427371', updated_at='2025-03-22 06:24:45.427371'
WHERE id=32;
UPDATE fukuoka_asobi_development.areas
SET area_name='七隈', district_id=6, slug='nanakum', created_at='2025-03-22 06:24:45.436885', updated_at='2025-03-22 06:24:45.436885'
WHERE id=33;
UPDATE fukuoka_asobi_development.areas
SET area_name='別府', district_id=6, slug='befu', created_at='2025-03-22 06:24:45.444070', updated_at='2025-03-22 06:24:45.444070'
WHERE id=34;
UPDATE fukuoka_asobi_development.areas
SET area_name='茶山', district_id=6, slug='chyama', created_at='2025-03-22 06:24:45.451143', updated_at='2025-03-22 06:24:45.451143'
WHERE id=35;
UPDATE fukuoka_asobi_development.areas
SET area_name='金山', district_id=6, slug='kanayama', created_at='2025-03-22 06:24:45.457681', updated_at='2025-03-22 06:24:45.457681'
WHERE id=36;
UPDATE fukuoka_asobi_development.areas
SET area_name='片江', district_id=6, slug='katae', created_at='2025-03-22 06:24:45.465837', updated_at='2025-03-22 06:24:45.465837'
WHERE id=37;
UPDATE fukuoka_asobi_development.areas
SET area_name='西新', district_id=7, slug='nishijin', created_at='2025-03-22 06:24:45.473875', updated_at='2025-03-22 06:24:45.473875'
WHERE id=38;
UPDATE fukuoka_asobi_development.areas
SET area_name='藤崎', district_id=7, slug='fujisaki', created_at='2025-03-22 06:24:45.483477', updated_at='2025-03-22 06:24:45.483477'
WHERE id=39;
UPDATE fukuoka_asobi_development.areas
SET area_name='百道', district_id=7, slug='momochi', created_at='2025-03-22 06:24:45.492635', updated_at='2025-03-22 06:24:45.492635'
WHERE id=40;
UPDATE fukuoka_asobi_development.areas
SET area_name='原', district_id=7, slug='NULL', created_at='2025-03-22 06:24:45.502197', updated_at='2025-03-22 06:24:45.502197'
WHERE id=41;
UPDATE fukuoka_asobi_development.areas
SET area_name='野芥', district_id=7, slug='noke', created_at='2025-03-22 06:24:45.511689', updated_at='2025-03-22 06:24:45.511689'
WHERE id=42;
UPDATE fukuoka_asobi_development.areas
SET area_name='次郎丸', district_id=7, slug='jiromaru', created_at='2025-03-22 06:24:45.520697', updated_at='2025-03-22 06:24:45.520697'
WHERE id=43;
UPDATE fukuoka_asobi_development.areas
SET area_name='四箇', district_id=7, slug='shika', created_at='2025-03-22 06:24:45.528855', updated_at='2025-03-22 06:24:45.528855'
WHERE id=44;