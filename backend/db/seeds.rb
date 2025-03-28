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

# カテゴリーのシードデータを読み込む
require_relative 'seeds/categories'

# 既存のデータを保持するスクリプトを読み込む
require_relative 'seeds/existing_data'

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

# 糟屋町のスポットと営業時間のシードデータを読み込む
puts "糟屋町のスポットと営業時間データを作成中..."
require_relative 'seeds/spots_with_opening_hours'

puts "シードデータの作成が完了しました！"
