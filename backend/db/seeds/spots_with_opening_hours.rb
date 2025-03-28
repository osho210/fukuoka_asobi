# 糟屋地区のスポットと営業時間を追加するseedスクリプト

# 既存の地区を取得（糟屋地区）
kasuya_district = District.find_by(slug: 'kasuya')

if kasuya_district.nil?
  puts "糟屋地区が見つかりません。先に地区データを作成してください。"
  return
end

# カテゴリを取得または作成
cafe_category = Category.find_or_create_by(name: 'cafe')
restaurant_category = Category.find_or_create_by(name: 'restaurant')
shopping_category = Category.find_or_create_by(name: 'shopping')

# おすすめ対象を取得または作成
family_recommended = RecommendedFor.find_or_create_by(name: '家族向け')
couple_recommended = RecommendedFor.find_or_create_by(name: 'カップル向け')
solo_recommended = RecommendedFor.find_or_create_by(name: '一人向け')
friends_recommended = RecommendedFor.find_or_create_by(name: '友達向け')

# 糟屋地区のスポットを作成
spots_data = [
  {
    spot_name: '糟屋カフェ',
    address: '福岡県糟屋郡粕屋町大字内橋1234',
    phone_number: '092-123-4567',
    website: 'https://example.com/kasuya-cafe',
    catchphrase: '自然豊かな糟屋町で味わう本格コーヒー',
    budget_range: '普通',
    is_rainy_ok: true,
    theme: 'グルメ',
    review_rating: 4.5,
    categories: [cafe_category],
    recommended_fors: [family_recommended, couple_recommended, solo_recommended],
    opening_hours: [
      { day_of_week: 'mon', open_time: '09:00', close_time: '18:00', is_closed_day: false },
      { day_of_week: 'tue', open_time: '09:00', close_time: '18:00', is_closed_day: false },
      { day_of_week: 'wed', open_time: '09:00', close_time: '18:00', is_closed_day: false },
      { day_of_week: 'thu', open_time: '09:00', close_time: '18:00', is_closed_day: false },
      { day_of_week: 'fri', open_time: '09:00', close_time: '18:00', is_closed_day: false },
      { day_of_week: 'sat', open_time: '10:00', close_time: '20:00', is_closed_day: false },
      { day_of_week: 'sun', open_time: '10:00', close_time: '17:00', is_closed_day: false }
    ]
  },
  {
    spot_name: '糟屋レストラン',
    address: '福岡県糟屋郡粕屋町大字仲原2345',
    phone_number: '092-234-5678',
    website: 'https://example.com/kasuya-restaurant',
    catchphrase: '地元食材にこだわった糟屋の味',
    budget_range: '普通',
    is_rainy_ok: true,
    theme: 'グルメ',
    review_rating: 4.2,
    categories: [restaurant_category],
    recommended_fors: [family_recommended, friends_recommended],
    opening_hours: [
      { day_of_week: 'mon', open_time: '11:00', close_time: '15:00', is_closed_day: false },
      { day_of_week: 'mon', open_time: '17:00', close_time: '22:00', is_closed_day: false },
      { day_of_week: 'tue', open_time: '11:00', close_time: '15:00', is_closed_day: false },
      { day_of_week: 'tue', open_time: '17:00', close_time: '22:00', is_closed_day: false },
      { day_of_week: 'wed', open_time: '11:00', close_time: '15:00', is_closed_day: false },
      { day_of_week: 'wed', open_time: '17:00', close_time: '22:00', is_closed_day: false },
      { day_of_week: 'thu', open_time: '11:00', close_time: '15:00', is_closed_day: false },
      { day_of_week: 'thu', open_time: '17:00', close_time: '22:00', is_closed_day: false },
      { day_of_week: 'fri', open_time: '11:00', close_time: '15:00', is_closed_day: false },
      { day_of_week: 'fri', open_time: '17:00', close_time: '22:00', is_closed_day: false },
      { day_of_week: 'sat', open_time: '11:00', close_time: '22:00', is_closed_day: false },
      { day_of_week: 'sun', open_time: '11:00', close_time: '21:00', is_closed_day: false }
    ]
  },
  {
    spot_name: '糟屋ショッピングモール',
    address: '福岡県糟屋郡粕屋町大字長者原3456',
    phone_number: '092-345-6789',
    website: 'https://example.com/kasuya-mall',
    catchphrase: '糟屋町最大のショッピングスポット',
    budget_range: '普通',
    is_rainy_ok: true,
    theme: 'コスパ',
    review_rating: 4.0,
    categories: [shopping_category],
    recommended_fors: [family_recommended, friends_recommended],
    opening_hours: [
      { day_of_week: 'mon', open_time: '10:00', close_time: '21:00', is_closed_day: false },
      { day_of_week: 'tue', open_time: '10:00', close_time: '21:00', is_closed_day: false },
      { day_of_week: 'wed', open_time: '10:00', close_time: '21:00', is_closed_day: false },
      { day_of_week: 'thu', open_time: '10:00', close_time: '21:00', is_closed_day: false },
      { day_of_week: 'fri', open_time: '10:00', close_time: '21:00', is_closed_day: false },
      { day_of_week: 'sat', open_time: '09:00', close_time: '22:00', is_closed_day: false },
      { day_of_week: 'sun', open_time: '09:00', close_time: '22:00', is_closed_day: false }
    ]
  }
]

# スポットとその関連データを作成
spots_data.each do |spot_data|
  # カテゴリとおすすめ対象を取り出す
  categories = spot_data.delete(:categories)
  recommended_fors = spot_data.delete(:recommended_fors)
  opening_hours_data = spot_data.delete(:opening_hours)

  # スポットを作成または更新
  spot = Spot.find_or_initialize_by(spot_name: spot_data[:spot_name])
  # spot_typeのデフォルト値を設定
  spot_data[:spot_type] = 'STORE' unless spot_data[:spot_type]
  spot.assign_attributes(spot_data.merge(district: kasuya_district))

  if spot.save
    puts "スポット「#{spot.spot_name}」を作成しました。"

    # カテゴリを関連付け
    categories.each do |category|
      SpotCategory.find_or_create_by(spot: spot, category: category)
    end

    # おすすめ対象を関連付け（最大2つまで）
    if recommended_fors.any?
      spot.recommended_for_1 = recommended_fors[0].name if recommended_fors[0]
      spot.recommended_for_2 = recommended_fors[1].name if recommended_fors[1]
      spot.save!
    end

    # 営業時間を作成
    opening_hours_data.each do |oh_data|
      # 既存のレコードを削除
      existing = OpeningHour.find_by(spot: spot, day_of_week: oh_data[:day_of_week])
      existing.destroy if existing

      # 新しいレコードを作成
      OpeningHour.create!(
        spot: spot,
        day_of_week: oh_data[:day_of_week],
        open_time: oh_data[:open_time],
        close_time: oh_data[:close_time],
        is_closed_day: oh_data[:is_closed_day]
      )
    end
  else
    puts "スポット「#{spot_data[:spot_name]}」の作成に失敗しました: #{spot.errors.full_messages.join(', ')}"
  end
end

puts "糟屋地区のスポットと営業時間の追加が完了しました。"
