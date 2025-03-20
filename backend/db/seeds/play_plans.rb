# 遊びのプランのシードデータ
puts "遊びのプランデータを作成中..."

# 既存のスポットを取得
hakata_cafe = Spot.find_by(spot_name: '博多スタイルカフェ')
tenjin_restaurant = Spot.find_by(spot_name: '天神イタリアン')

# ユーザーを取得
editor_user = User.find_by(email: 'editor@example.com')
user1 = User.find_by(email: 'user1@example.com')
user2 = User.find_by(email: 'user2@example.com')

# おすすめ対象のデータを作成
puts "おすすめ対象データを作成中..."
recommended_fors = %w[カップル 友人 家族 一人 女子会 男子会 デート 記念日 誕生日].map do |name|
  RecommendedFor.find_or_create_by!(name: name)
end

# プラン1: 博多駅周辺デートプラン
hakata_date_plan = PlayPlan.find_or_create_by!(
  plan_name: '博多駅周辺半日デートプラン',
  description: '博多駅周辺で楽しむカフェとショッピングの半日デートプラン',
  status: :published,
  favorite_count: 25,
  rating: 4.2,
  review_count: 8,
  image_url: 'itoshima.png',
  tags: 'デート,カフェ,ショッピング',
  location: '博多駅周辺',
  trip_type: :day_trip,
  total_budget: 5000,
  planner_title: 'プランナーおすすめ！博多駅周辺デートコース',
  planner_description: 'プランナーの私がおすすめする、博多駅周辺で楽しめる半日デートプランです。カフェでゆっくりランチを楽しんだ後は、駅周辺のショッピングモールで買い物を楽しめます。',
  user: editor_user
)

# おすすめ対象を設定
hakata_date_plan.recommended_for_string = 'カップル, デート'

# プラン1の詳細
if hakata_date_plan.plan_details.empty?
  PlanDetail.create!(
    play_plan: hakata_date_plan,
    step_number: 1,
    step_name: '博多駅で待ち合わせ',
    step_description: '博多駅中央改札口で待ち合わせ',
    comment: '人が多いので、改札口の前の広場で待ち合わせるのがおすすめ',
    start_datetime: Time.now.beginning_of_day + 13.hours,
    end_datetime: Time.now.beginning_of_day + 13.hours + 15.minutes,
    budget: 0
  )

  PlanDetail.create!(
    play_plan: hakata_date_plan,
    step_number: 2,
    step_name: '博多スタイルカフェでランチ',
    step_description: '博多駅直結のおしゃれカフェでランチを楽しむ',
    spot: hakata_cafe,
    comment: 'ランチセットがおすすめ。窓側の席だと景色も楽しめます。',
    start_datetime: Time.now.beginning_of_day + 13.hours + 15.minutes,
    end_datetime: Time.now.beginning_of_day + 14.hours + 30.minutes,
    budget: 2000
  )

  PlanDetail.create!(
    play_plan: hakata_date_plan,
    step_number: 3,
    step_name: '博多駅周辺でショッピング',
    step_description: '博多駅の商業施設でショッピングを楽しむ',
    comment: 'アミュプラザ博多やJR博多シティがおすすめ',
    start_datetime: Time.now.beginning_of_day + 14.hours + 30.minutes,
    end_datetime: Time.now.beginning_of_day + 16.hours + 30.minutes,
    budget: 3000
  )
end

# プラン2: 天神グルメ巡りプラン
tenjin_gourmet_plan = PlayPlan.find_or_create_by!(
  plan_name: '天神グルメ巡り夜プラン',
  description: '天神エリアで楽しむ本格イタリアンと夜景の大人プラン',
  status: :published,
  favorite_count: 18,
  rating: 4.5,
  review_count: 6,
  image_url: 'itoshima.png',
  tags: 'グルメ,夜景,イタリアン',
  location: '天神',
  trip_type: :day_trip,
  total_budget: 8000,
  planner_title: '大人の夜を楽しむ天神グルメ＆夜景プラン',
  planner_description: '天神の隠れ家イタリアンで本格的なディナーを楽しんだ後は、福岡タワーから美しい夜景を一望できる大人のプランです。特別な日のデートにもおすすめです。',
  user: user1
)

# おすすめ対象を設定
tenjin_gourmet_plan.recommended_for_string = 'カップル, 友人, デート, 記念日'

# プラン2の詳細
if tenjin_gourmet_plan.plan_details.empty?
  PlanDetail.create!(
    play_plan: tenjin_gourmet_plan,
    step_number: 1,
    step_name: '天神駅で待ち合わせ',
    step_description: '天神駅西口で待ち合わせ',
    comment: '駅の改札を出て右側のスターバックス前がわかりやすい',
    start_datetime: Time.now.beginning_of_day + 18.hours,
    end_datetime: Time.now.beginning_of_day + 18.hours + 15.minutes,
    budget: 0
  )

  PlanDetail.create!(
    play_plan: tenjin_gourmet_plan,
    step_number: 2,
    step_name: '天神イタリアンでディナー',
    step_description: '隠れ家的な本格イタリアンレストランでディナー',
    spot: tenjin_restaurant,
    comment: 'コースメニューがおすすめ。予約必須です。',
    start_datetime: Time.now.beginning_of_day + 18.hours + 15.minutes,
    end_datetime: Time.now.beginning_of_day + 20.hours,
    budget: 6000
  )

  PlanDetail.create!(
    play_plan: tenjin_gourmet_plan,
    step_number: 3,
    step_name: '福岡タワーで夜景鑑賞',
    step_description: '福岡タワーから福岡市の夜景を一望',
    comment: 'タクシーで15分程度。最終入場は22:00なので注意',
    start_datetime: Time.now.beginning_of_day + 20.hours + 30.minutes,
    end_datetime: Time.now.beginning_of_day + 21.hours + 30.minutes,
    budget: 2000
  )
end

# プラン3: 下書き状態のプラン
draft_plan = PlayPlan.find_or_create_by!(
  plan_name: '糸島日帰り旅行プラン（作成中）',
  description: '自然豊かな糸島を巡る日帰り旅行プラン',
  status: :draft,
  favorite_count: 0,
  rating: 0.0,
  review_count: 0,
  tags: '自然,海,カフェ',
  location: '糸島',
  trip_type: :day_trip,
  total_budget: 10000,
  planner_title: '自然を満喫！糸島の魅力発見プラン',
  planner_description: '糸島の美しい自然と美味しいグルメを楽しむ日帰り旅行プランです。海岸線のドライブや地元の新鮮な食材を使ったカフェめぐりがおすすめです。',
  user: user2
)

# おすすめ対象を設定
draft_plan.recommended_for_string = '友人, 家族'

puts "遊びのプランデータの作成が完了しました！"
