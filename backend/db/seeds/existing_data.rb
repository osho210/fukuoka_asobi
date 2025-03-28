# 既存のデータベースレコードを保持するためのseedスクリプト
require 'securerandom'

# 既存の地区データを保持
puts "既存の地区データを保持中..."

# 地区データ（ID 1-19）
district_data = [
  # ID 1-7は既に追加済み（博多区, 中央区, 東区, 南区, 西区, 城南区, 早良区）
  # 念のため1-7も追加
  { id: 1, district_name: '博多区', slug: 'hakata' },
  { id: 2, district_name: '中央区', slug: 'chuo' },
  { id: 3, district_name: '東区', slug: 'higashi' },
  { id: 4, district_name: '南区', slug: 'minami' },
  { id: 5, district_name: '西区', slug: 'nishi' },
  { id: 6, district_name: '城南区', slug: 'jonan' },
  { id: 7, district_name: '早良区', slug: 'sawara' },
  # ID 8-19の追加データ
  { id: 8, district_name: '糸島市', slug: 'itoshima' },
  { id: 9, district_name: '糟屋郡', slug: 'kasuya' },
  # 他の地区データがあれば追加
]

# 既存の地区データを保持
district_data.each do |data|
  # slugが既に存在するかチェック
  existing_district_by_slug = District.find_by(slug: data[:slug])
  district = District.find_by(id: data[:id])

  if district
    # 既存のレコードを更新（slugが重複する場合は更新しない）
    if existing_district_by_slug && existing_district_by_slug.id != data[:id]
      # slugを一時的に変更して更新
      temp_data = data.dup
      temp_data[:slug] = "#{data[:slug]}-#{SecureRandom.hex(4)}"
      district.update!(temp_data)
      puts "地区ID #{data[:id]} (#{data[:district_name]}) を更新しました。slugが重複するため一時的なslugを使用: #{temp_data[:slug]}"
    else
      district.update!(data)
      puts "地区ID #{data[:id]} (#{data[:district_name]}) を更新しました。"
    end
  else
    # 新しいレコードを作成（IDを指定）
    if existing_district_by_slug
      # slugが重複する場合は一時的なslugを使用
      temp_data = data.dup
      temp_data[:slug] = "#{data[:slug]}-#{SecureRandom.hex(4)}"
      District.create!(temp_data)
      puts "地区ID #{data[:id]} (#{data[:district_name]}) を作成しました。slugが重複するため一時的なslugを使用: #{temp_data[:slug]}"
    else
      District.create!(data)
      puts "地区ID #{data[:id]} (#{data[:district_name]}) を作成しました。"
    end
  end
end

# 既存の地域データを保持
puts "既存の地域データを保持中..."

# 地域データ（ID 1-44）
area_data = [
  # 博多区の地域
  { id: 1, area_name: '博多駅周辺', district_id: 1, slug: 'hakata-station' },
  { id: 2, area_name: '祇園', district_id: 1, slug: 'gion' },
  { id: 3, area_name: '中洲', district_id: 1, slug: 'nakasu' },
  { id: 4, area_name: '冷泉', district_id: 1, slug: 'reisen' },
  { id: 5, area_name: '東比恵', district_id: 1, slug: 'higashi-hie' },
  { id: 6, area_name: '吉塚', district_id: 1, slug: 'yoshizuka' },
  { id: 7, area_name: '千代', district_id: 1, slug: 'chiyo' },

  # 中央区の地域
  { id: 8, area_name: '天神', district_id: 2, slug: 'tenjin' },
  { id: 9, area_name: '大名', district_id: 2, slug: 'daimyo' },
  { id: 10, area_name: '今泉', district_id: 2, slug: 'imaizumi' },
  { id: 11, area_name: '赤坂', district_id: 2, slug: 'akasaka' },
  { id: 12, area_name: '薬院', district_id: 2, slug: 'yakuin' },
  { id: 13, area_name: '平尾', district_id: 2, slug: 'hirao' },
  { id: 14, area_name: '六本松', district_id: 2, slug: 'ropponmatsu' },
  { id: 15, area_name: '桜坂', district_id: 2, slug: 'sakurazaka' },
  { id: 16, area_name: '大濠', district_id: 2, slug: 'ohori' },
  { id: 17, area_name: '舞鶴', district_id: 2, slug: 'maizuru' },

  # 東区の地域
  { id: 18, area_name: '箱崎', district_id: 3, slug: 'hakozaki' },
  { id: 19, area_name: '香椎', district_id: 3, slug: 'kashii' },
  { id: 20, area_name: '和白', district_id: 3, slug: 'wajiro' },
  { id: 21, area_name: '名島', district_id: 3, slug: 'najima' },
  { id: 22, area_name: '千早', district_id: 3, slug: 'chihaya' },

  # 南区の地域
  { id: 23, area_name: '大橋', district_id: 4, slug: 'ohashi' },
  { id: 24, area_name: '高宮', district_id: 4, slug: 'takamiya' },
  { id: 25, area_name: '野多目', district_id: 4, slug: 'notame' },
  { id: 26, area_name: '塩原', district_id: 4, slug: 'shiobaru' },
  { id: 27, area_name: '長住', district_id: 4, slug: 'nagasumi' },

  # 西区の地域
  { id: 28, area_name: '姪浜', district_id: 5, slug: 'meinohama' },
  { id: 29, area_name: '室見', district_id: 5, slug: 'muromi' },
  { id: 30, area_name: '今宿', district_id: 5, slug: 'imajuku' },
  { id: 31, area_name: '糸島', district_id: 5, slug: 'itoshima' },

  # 城南区の地域
  { id: 32, area_name: '七隈', district_id: 6, slug: 'nanakuma' },
  { id: 33, area_name: '別府', district_id: 6, slug: 'befu' },
  { id: 34, area_name: '茶山', district_id: 6, slug: 'chayama' },
  { id: 35, area_name: '金山', district_id: 6, slug: 'kanayama' },
  { id: 36, area_name: '片江', district_id: 6, slug: 'katae' },

  # 早良区の地域
  { id: 37, area_name: '藤崎', district_id: 7, slug: 'fujisaki' },
  { id: 38, area_name: '百道', district_id: 7, slug: 'momochi' },
  { id: 39, area_name: '原', district_id: 7, slug: 'hara' },
  { id: 40, area_name: '野芥', district_id: 7, slug: 'noke' },
  { id: 41, area_name: '次郎丸', district_id: 7, slug: 'jiromaru' },
  { id: 42, area_name: '四箇', district_id: 7, slug: 'shika' },

  # 糟屋郡の地域
  { id: 43, area_name: '内橋', district_id: 9, slug: 'uchihashi' },
  { id: 44, area_name: '仲原', district_id: 9, slug: 'nakabaru' },
  { id: 45, area_name: '長者原', district_id: 9, slug: 'chojabaru' },
  { id: 46, area_name: '駕与丁', district_id: 9, slug: 'kayotei' },
  { id: 47, area_name: '大隈', district_id: 9, slug: 'okuma' },
  { id: 48, area_name: '江辻', district_id: 9, slug: 'etsuji' },
  { id: 49, area_name: '戸原', district_id: 9, slug: 'tohara' },
  { id: 50, area_name: '花ヶ浦', district_id: 9, slug: 'hanagaura' }
]

# 既存の地域データを保持
area_data.each do |data|
  # slugが既に存在するかチェック
  existing_area_by_slug = Area.find_by(slug: data[:slug])
  area = Area.find_by(id: data[:id])

  if area
    # 既存のレコードを更新（slugが重複する場合は更新しない）
    if existing_area_by_slug && existing_area_by_slug.id != data[:id]
      # slugを一時的に変更して更新
      temp_data = data.dup
      temp_data[:slug] = "#{data[:slug]}-#{SecureRandom.hex(4)}"
      area.update!(temp_data)
      puts "地域ID #{data[:id]} (#{data[:area_name]}) を更新しました。slugが重複するため一時的なslugを使用: #{temp_data[:slug]}"
    else
      area.update!(data)
      puts "地域ID #{data[:id]} (#{data[:area_name]}) を更新しました。"
    end
  else
    # 新しいレコードを作成（IDを指定）
    if existing_area_by_slug
      # slugが重複する場合は一時的なslugを使用
      temp_data = data.dup
      temp_data[:slug] = "#{data[:slug]}-#{SecureRandom.hex(4)}"
      Area.create!(temp_data)
      puts "地域ID #{data[:id]} (#{data[:area_name]}) を作成しました。slugが重複するため一時的なslugを使用: #{temp_data[:slug]}"
    else
      Area.create!(data)
      puts "地域ID #{data[:id]} (#{data[:area_name]}) を作成しました。"
    end
  end
end

puts "既存データの保持が完了しました。"
