# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

puts "シードデータの作成を開始します..."

# カテゴリーテーブル
puts "カテゴリーデータを作成中..."
['カフェ', 'レストラン', 'アクティビティ', '観光地', 'ショッピング', 'イベント', 'その他'].each do |category_name|
  Category.find_or_create_by!(name: category_name)
end

# 地区テーブル
puts "地区データを作成中..."
['博多区', '中央区', '東区', '南区', '西区', '城南区', '早良区'].each do |district_name|
  District.find_or_create_by!(district_name: district_name)
end

# 地域テーブル
puts "地域データを作成中..."
{
  '博多区' => ['博多駅周辺', '祇園', '中洲', '冷泉', '東比恵', '吉塚', '千代'],
  '中央区' => ['天神', '大名', '今泉', '赤坂', '薬院', '平尾', '六本松', '桜坂', '大濠', '舞鶴'],
  '東区' => ['箱崎', '香椎', '和白', '名島', '千早'],
  '南区' => ['大橋', '高宮', '野多目', '塩原', '長住'],
  '西区' => ['姪浜', '西新', '室見', '今宿', '糸島'],
  '城南区' => ['七隈', '別府', '茶山', '金山', '片江'],
  '早良区' => ['西新', '藤崎', '百道', '原', '野芥', '次郎丸', '四箇']
}.each do |district_name, area_names|
  district = District.find_by(district_name: district_name)
  area_names.each do |area_name|
    Area.find_or_create_by!(area_name: area_name, district: district)
  end
end

# ハッシュタグテーブル
puts "ハッシュタグデータを作成中..."
['#福岡カフェ', '#福岡グルメ', '#福岡観光', '#福岡ランチ', '#福岡ディナー', '#福岡スイーツ', '#福岡デート', '#福岡アクティビティ', '#福岡ショッピング', '#福岡イベント', '#福岡夜景', '#福岡海', '#福岡山', '#福岡公園', '#福岡神社', '#福岡寺院', '#福岡歴史', '#福岡文化', '#福岡アート', '#福岡音楽'].each do |hashtag_name|
  Hashtag.find_or_create_by!(hashtag_name: hashtag_name)
end

# 目的テーブル
puts "目的データを作成中..."
['デート', '友達と', '家族と', '一人で', 'ビジネス', '観光', 'イベント', 'パーティー', '記念日', '誕生日'].each do |purpose_name|
  Purpose.find_or_create_by!(purpose_name: purpose_name)
end

# お店の雰囲気テーブル
puts "お店の雰囲気データを作成中..."
['おしゃれ', 'カジュアル', '高級', '落ち着いた', '賑やか', 'アットホーム', 'モダン', 'レトロ', '和風', '洋風', 'アジアン', '隠れ家', '眺めがいい', '静か', '広々', '個室あり'].each do |ambiance_name|
  StoreAmbiance.find_or_create_by!(ambiance_name: ambiance_name)
end

# サンプル店舗データ
puts "サンプル店舗データを作成中..."
# 博多区の店舗
hakata_district = District.find_by(district_name: '博多区')
hakata_station_area = Area.find_by(area_name: '博多駅周辺')
cafe_category = Category.find_by(name: 'カフェ')
restaurant_category = Category.find_by(name: 'レストラン')
date_purpose = Purpose.find_by(purpose_name: 'デート')
friends_purpose = Purpose.find_by(purpose_name: '友達と')
stylish_ambiance = StoreAmbiance.find_by(ambiance_name: 'おしゃれ')
casual_ambiance = StoreAmbiance.find_by(ambiance_name: 'カジュアル')
fukuoka_cafe_hashtag = Hashtag.find_by(hashtag_name: '#福岡カフェ')
fukuoka_gourmet_hashtag = Hashtag.find_by(hashtag_name: '#福岡グルメ')

# 博多駅周辺のカフェ
hakata_cafe = Store.find_or_create_by!(
  district: hakata_district,
  store_name: '博多スタイルカフェ',
  address: '福岡県福岡市博多区博多駅前X-X-X',
  phone_number: '092-XXX-XXXX',
  website: 'https://example.com/hakata-cafe',
  catchphrase: '博多駅直結！おしゃれな空間で過ごすくつろぎのカフェタイム',
  recommended_for_1: 'こだわりの自家焙煎コーヒー',
  recommended_for_2: '博多産食材を使ったスイーツ',
  parking_available: false,
  nearest_station: '博多駅',
  review_rating: 4.5,
  review_count: 120,
  instagram_url: 'https://instagram.com/example',
  is_closed: false,
  budget_range: '普通',
  max_people: 40,
  min_people: 1,
  is_rainy_ok: true,
  theme: 'コスパ'
)

# 店舗-地域の関連付け
StoreArea.find_or_create_by!(store: hakata_cafe, area: hakata_station_area)

# 店舗-カテゴリの関連付け
StoreCategory.find_or_create_by!(store: hakata_cafe, category: cafe_category)

# 店舗-ハッシュタグの関連付け
StoreHashtag.find_or_create_by!(store: hakata_cafe, hashtag: fukuoka_cafe_hashtag)

# 店舗-目的の関連付け
StorePurpose.find_or_create_by!(store: hakata_cafe, purpose: date_purpose)
StorePurpose.find_or_create_by!(store: hakata_cafe, purpose: friends_purpose)

# 店舗-雰囲気の関連付け
StoreAmbianceRelation.find_or_create_by!(store: hakata_cafe, store_ambiance: stylish_ambiance)

# 営業時間の設定
['月', '火', '水', '木', '金'].each do |day|
  OpeningHour.find_or_create_by!(
    store: hakata_cafe,
    day_of_week: day,
    open_time: '10:00',
    close_time: '21:00'
  )
end

['土', '日'].each do |day|
  OpeningHour.find_or_create_by!(
    store: hakata_cafe,
    day_of_week: day,
    open_time: '11:00',
    close_time: '20:00'
  )
end

# メニューの作成
coffee_menu = Menu.find_or_create_by!(
  menu_name: '博多ブレンドコーヒー',
  price: 500,
  description: '厳選した豆を使用した当店オリジナルブレンド'
)

cake_menu = Menu.find_or_create_by!(
  menu_name: '博多苺のショートケーキ',
  price: 650,
  description: '地元の苺をたっぷり使用した自家製ケーキ'
)

# 店舗-メニューの関連付け
StoreMenu.find_or_create_by!(store: hakata_cafe, menu: coffee_menu)
StoreMenu.find_or_create_by!(store: hakata_cafe, menu: cake_menu)

# 中央区の店舗
chuo_district = District.find_by(district_name: '中央区')
tenjin_area = Area.find_by(area_name: '天神')

# 天神のレストラン
tenjin_restaurant = Store.find_or_create_by!(
  district: chuo_district,
  store_name: '天神イタリアン',
  address: '福岡県福岡市中央区天神X-X-X',
  phone_number: '092-XXX-XXXX',
  website: 'https://example.com/tenjin-italian',
  catchphrase: '天神の隠れ家イタリアン。本場の味を福岡で。',
  recommended_for_1: '自家製生パスタ',
  recommended_for_2: '厳選ワイン',
  parking_available: true,
  nearest_station: '天神駅',
  review_rating: 4.7,
  review_count: 85,
  instagram_url: 'https://instagram.com/example2',
  is_closed: false,
  budget_range: '高い',
  max_people: 30,
  min_people: 2,
  is_rainy_ok: true,
  theme: '文化と歴史'
)

# 店舗-地域の関連付け
StoreArea.find_or_create_by!(store: tenjin_restaurant, area: tenjin_area)

# 店舗-カテゴリの関連付け
StoreCategory.find_or_create_by!(store: tenjin_restaurant, category: restaurant_category)

# 店舗-ハッシュタグの関連付け
StoreHashtag.find_or_create_by!(store: tenjin_restaurant, hashtag: fukuoka_gourmet_hashtag)

# 店舗-目的の関連付け
StorePurpose.find_or_create_by!(store: tenjin_restaurant, purpose: date_purpose)

# 店舗-雰囲気の関連付け
StoreAmbianceRelation.find_or_create_by!(store: tenjin_restaurant, store_ambiance: stylish_ambiance)

# 営業時間の設定
['月', '火', '水', '木', '金', '土', '日'].each do |day|
  OpeningHour.find_or_create_by!(
    store: tenjin_restaurant,
    day_of_week: day,
    open_time: '17:00',
    close_time: '23:00'
  )
end

# メニューの作成
pasta_menu = Menu.find_or_create_by!(
  menu_name: '自家製カルボナーラ',
  price: 1500,
  description: '自家製生パスタと厳選素材で作る本格カルボナーラ'
)

wine_menu = Menu.find_or_create_by!(
  menu_name: 'イタリア産赤ワイン（グラス）',
  price: 800,
  description: 'ソムリエ厳選のイタリア産赤ワイン'
)

# 店舗-メニューの関連付け
StoreMenu.find_or_create_by!(store: tenjin_restaurant, menu: pasta_menu)
StoreMenu.find_or_create_by!(store: tenjin_restaurant, menu: wine_menu)

puts "シードデータの作成が完了しました！"
