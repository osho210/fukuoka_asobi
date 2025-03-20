# スポットのシードデータ
puts "スポットデータを作成中..."

# 既存の地区、カテゴリー、目的などを取得
hakata_district = District.find_by(district_name: '博多区')
chuo_district = District.find_by(district_name: '中央区')
hakata_station_area = Area.find_by(area_name: '博多駅周辺')
tenjin_area = Area.find_by(area_name: '天神')
cafe_category = Category.find_by(name: 'カフェ')
restaurant_category = Category.find_by(name: 'レストラン')
date_purpose = Purpose.find_by(purpose_name: 'デート')
friends_purpose = Purpose.find_by(purpose_name: '友達と')
stylish_ambiance = SpotAmbiance.find_by(ambiance_name: 'おしゃれ')
casual_ambiance = SpotAmbiance.find_by(ambiance_name: 'カジュアル')
fukuoka_cafe_hashtag = Hashtag.find_by(hashtag_name: '#福岡カフェ')
fukuoka_gourmet_hashtag = Hashtag.find_by(hashtag_name: '#福岡グルメ')

# 博多駅周辺のカフェ（店舗タイプ）
hakata_cafe = Spot.find_or_create_by!(
  district: hakata_district,
  spot_name: '博多スタイルカフェ',
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
  theme: 'コスパ',
  image_url: 'itoshima.png',
  spot_type: 'STORE'
)

# 店舗-地域の関連付け
SpotArea.find_or_create_by!(spot: hakata_cafe, area: hakata_station_area)

# 店舗-カテゴリの関連付け
SpotCategory.find_or_create_by!(spot: hakata_cafe, category: cafe_category)

# 店舗-ハッシュタグの関連付け
SpotHashtag.find_or_create_by!(spot: hakata_cafe, hashtag: fukuoka_cafe_hashtag)

# 店舗-目的の関連付け
SpotPurpose.find_or_create_by!(spot: hakata_cafe, purpose: date_purpose)
SpotPurpose.find_or_create_by!(spot: hakata_cafe, purpose: friends_purpose)

# 店舗-雰囲気の関連付け
SpotAmbianceRelation.find_or_create_by!(spot: hakata_cafe, spot_ambiance: stylish_ambiance)

# 営業時間の設定
['月', '火', '水', '木', '金'].each do |day|
  OpeningHour.find_or_create_by!(
    spot: hakata_cafe,
    day_of_week: day,
    open_time: '10:00',
    close_time: '21:00'
  )
end

['土', '日'].each do |day|
  OpeningHour.find_or_create_by!(
    spot: hakata_cafe,
    day_of_week: day,
    open_time: '11:00',
    close_time: '20:00'
  )
end

# 天神のレストラン（店舗タイプ）
tenjin_restaurant = Spot.find_or_create_by!(
  district: chuo_district,
  spot_name: '天神イタリアン',
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
  theme: '文化と歴史',
  image_url: 'itoshima.png',
  spot_type: 'STORE'
)

# 店舗-地域の関連付け
SpotArea.find_or_create_by!(spot: tenjin_restaurant, area: tenjin_area)

# 店舗-カテゴリの関連付け
SpotCategory.find_or_create_by!(spot: tenjin_restaurant, category: restaurant_category)

# 店舗-ハッシュタグの関連付け
SpotHashtag.find_or_create_by!(spot: tenjin_restaurant, hashtag: fukuoka_gourmet_hashtag)

# 店舗-目的の関連付け
SpotPurpose.find_or_create_by!(spot: tenjin_restaurant, purpose: date_purpose)

# 店舗-雰囲気の関連付け
SpotAmbianceRelation.find_or_create_by!(spot: tenjin_restaurant, spot_ambiance: stylish_ambiance)

# 営業時間の設定
['月', '火', '水', '木', '金', '土', '日'].each do |day|
  OpeningHour.find_or_create_by!(
    spot: tenjin_restaurant,
    day_of_week: day,
    open_time: '17:00',
    close_time: '23:00'
  )
end

# 観光スポット（TOURIST_SPOT タイプ）
fukuoka_tower = Spot.find_or_create_by!(
  district: chuo_district,
  spot_name: '福岡タワー',
  address: '福岡県福岡市早良区百道浜2-3-26',
  phone_number: '092-823-0234',
  website: 'https://www.fukuokatower.co.jp/',
  catchphrase: '福岡市のシンボル、高さ234mの海浜タワー',
  recommended_for_1: '夜景観賞',
  recommended_for_2: '展望台からの眺望',
  parking_available: true,
  nearest_station: '福岡タワー前駅',
  review_rating: 4.3,
  review_count: 230,
  instagram_url: 'https://www.instagram.com/fukuokatower/',
  is_closed: false,
  budget_range: '普通',
  max_people: 100,
  min_people: 1,
  is_rainy_ok: true,
  theme: '文化と歴史',
  image_url: 'itoshima.png',
  spot_type: 'TOURIST_SPOT'
)

# アクティビティ（ACTIVITY タイプ）
marine_activity = Spot.find_or_create_by!(
  district: District.find_by(district_name: '西区'),
  spot_name: '糸島マリンアクティビティ',
  address: '福岡県糸島市志摩海岸',
  phone_number: '092-XXX-YYYY',
  website: 'https://example.com/itoshima-marine',
  catchphrase: '糸島の美しい海でマリンスポーツを楽しもう！',
  recommended_for_1: 'SUP体験',
  recommended_for_2: 'シーカヤック',
  parking_available: true,
  nearest_station: '筑前前原駅',
  review_rating: 4.8,
  review_count: 75,
  instagram_url: 'https://instagram.com/example3',
  is_closed: false,
  budget_range: '高い',
  max_people: 20,
  min_people: 2,
  is_rainy_ok: false,
  theme: 'アクティブ',
  image_url: 'itoshima.png',
  spot_type: 'ACTIVITY'
)

# もう一つの観光スポット
ohori_park = Spot.find_or_create_by!(
  district: chuo_district,
  spot_name: '大濠公園',
  address: '福岡県福岡市中央区大濠公園',
  phone_number: '092-XXX-ZZZZ',
  website: 'https://example.com/ohori-park',
  catchphrase: '福岡市民の憩いの場、広大な池を囲む都市公園',
  recommended_for_1: '散策',
  recommended_for_2: 'ボート遊び',
  parking_available: true,
  nearest_station: '大濠公園駅',
  review_rating: 4.6,
  review_count: 180,
  instagram_url: 'https://instagram.com/example4',
  is_closed: false,
  budget_range: '安い',
  max_people: 100,
  min_people: 1,
  is_rainy_ok: false,
  theme: '自然',
  image_url: 'itoshima.png',
  spot_type: 'TOURIST_SPOT'
)

puts "スポットデータの作成が完了しました！"
