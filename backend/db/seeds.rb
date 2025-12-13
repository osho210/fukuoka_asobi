# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# 本番環境ではシードデータを実行しない
return if Rails.env.production?

puts "シードデータの作成を開始します..."

# カテゴリーのシードデータを読み込む
require_relative 'seeds/categories'

# 地区テーブル
puts "地区データを作成中..."
['博多区', '中央区', '東区', '南区', '西区', '城南区', '早良区'].each do |district_name|
  District.find_or_create_by!(district_name: district_name)
end

#駅テーブル
puts "駅データを作成中..."
['博多駅', '南福岡駅', '中洲川端駅', '赤坂駅', '薬院駅', '大濠公園駅', '西新駅', '姪浜駅', '香椎駅', '箱崎駅'].each do |station_name|
  Station.find_or_create_by!(name: station_name, description: "#{station_name}の説明", active: true)
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

# スポットの雰囲気テーブル
puts "スポットの雰囲気データを作成中..."
['おしゃれ', 'カジュアル', '高級', '落ち着いた', '賑やか', 'アットホーム', 'モダン', 'レトロ', '和風', '洋風', 'アジアン', '隠れ家', '眺めがいい', '静か', '広々', '個室あり'].each do |ambiance_name|
  SpotAmbiance.find_or_create_by!(ambiance_name: ambiance_name)
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

# スポットのシードデータを読み込む
require_relative 'seeds/spots'

# ユーザーのシードデータを読み込む
require_relative 'seeds/users'

# 遊びのプランのシードデータを読み込む
require_relative 'seeds/play_plans'

# おすすめ対象のシードデータを読み込む
require_relative 'seeds/recommended_fors'

# イベントカテゴリのシードデータを読み込む
require_relative 'seeds/event_categories'

# イベントのシードデータを読み込む
require_relative 'seeds/events'

# ニュースのシードデータを読み込む
require_relative 'seeds/news'

# 移動手段のシードデータを読み込む
require_relative 'seeds/travel_methods'

puts "シードデータの作成が完了しました！"
