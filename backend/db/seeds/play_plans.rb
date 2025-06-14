# 遊びのプランのシードデータ
puts "遊びのプランデータを作成中..."

# 既存のスポットを取得
hakata_cafe = Spot.find_by(spot_name: '博多スタイルカフェ')
tenjin_restaurant = Spot.find_by(spot_name: '天神イタリアン')
fukuoka_tower = Spot.find_by(spot_name: '福岡タワー')

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

# 追加のスポットを取得
hakata_shopping = Spot.find_or_create_by!(
  spot_name: '博多駅商業施設',
  address: '福岡県福岡市博多区博多駅中央街1-1',
  catchphrase: '博多駅直結の大型ショッピングモール',
  district: District.find_by(district_name: '博多区'),
  budget_range: 'AVERAGE',
  theme: 'コスパ',
  spot_type: 'STORE',
  is_rainy_ok: true
)
tenjin_station = Spot.find_or_create_by!(
  spot_name: '天神駅',
  address: '福岡県福岡市中央区天神2丁目',
  catchphrase: '福岡市の中心部にある主要駅',
  district: District.find_by(district_name: '中央区'),
  budget_range: 'CHEAP',
  theme: '文化と歴史',
  spot_type: 'TOURIST_SPOT',
  is_rainy_ok: true
)

# プラン1の詳細
if hakata_date_plan.plan_details.empty?
  # 博多駅で待ち合わせ
  hakata_station = Spot.find_or_create_by!(
    spot_name: '博多駅',
    address: '福岡県福岡市博多区博多駅中央街1-1',
    catchphrase: '九州の玄関口',
    district: District.find_by(district_name: '博多区'),
    budget_range: 'CHEAP',
    theme: '文化と歴史',
    spot_type: 'TOURIST_SPOT',
    is_rainy_ok: true
  )

  PlanDetail.create!(
    play_plan: hakata_date_plan,
    step_number: 1,
    step_name: '博多駅で待ち合わせ',
    step_description: '博多駅中央改札口で待ち合わせ',
    spot: hakata_station,
    comment: '人が多いので、改札口の前の広場で待ち合わせるのがおすすめ',
    start_datetime: Time.now.beginning_of_day + 13.hours,
    end_datetime: Time.now.beginning_of_day + 13.hours + 15.minutes,
    budget: 0,
    planner_title: '待ち合わせのコツ',
    planner_description: '博多駅は人が多いので、待ち合わせ場所を明確にしておくことが大切です。中央改札口前の広場は目印になりやすく、待ち合わせに最適です。'
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
    budget: 2000,
    planner_title: 'カフェ選びのポイント',
    planner_description: '博多スタイルカフェは、地元の食材を使った料理が自慢のカフェです。窓側の席からは博多の街並みを眺めることができ、デートにぴったりの雰囲気です。'
  )

  PlanDetail.create!(
    play_plan: hakata_date_plan,
    step_number: 3,
    step_name: '博多駅周辺でショッピング',
    step_description: '博多駅の商業施設でショッピングを楽しむ',
    spot: hakata_shopping,
    comment: 'アミュプラザ博多やJR博多シティがおすすめ',
    start_datetime: Time.now.beginning_of_day + 14.hours + 30.minutes,
    end_datetime: Time.now.beginning_of_day + 16.hours + 30.minutes,
    budget: 3000,
    planner_title: 'ショッピングを楽しむコツ',
    planner_description: '博多駅周辺には、アミュプラザ博多やJR博多シティなど大型商業施設が充実しています。地元ブランドのショップも多いので、お土産探しにもぴったりです。'
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
    spot: tenjin_station,
    comment: '駅の改札を出て右側のスターバックス前がわかりやすい',
    start_datetime: Time.now.beginning_of_day + 18.hours,
    end_datetime: Time.now.beginning_of_day + 18.hours + 15.minutes,
    budget: 0,
    planner_title: '天神での待ち合わせポイント',
    planner_description: '天神駅は福岡市の中心部にあり、多くの人で賑わっています。西口のスターバックス前は目立つランドマークなので、待ち合わせに最適です。'
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
    budget: 6000,
    planner_title: '大人のイタリアンディナー',
    planner_description: '天神イタリアンは地元で人気の隠れ家レストランです。シェフ自慢の本格イタリアン料理を楽しめます。特別な日のディナーにぴったりの雰囲気です。予約は2週間前から受け付けています。'
  )

  PlanDetail.create!(
    play_plan: tenjin_gourmet_plan,
    step_number: 3,
    step_name: '福岡タワーで夜景鑑賞',
    step_description: '福岡タワーから福岡市の夜景を一望',
    spot: fukuoka_tower,
    comment: 'タクシーで15分程度。最終入場は22:00なので注意',
    start_datetime: Time.now.beginning_of_day + 20.hours + 30.minutes,
    end_datetime: Time.now.beginning_of_day + 21.hours + 30.minutes,
    budget: 2000,
    planner_title: '福岡の夜景を楽しむ',
    planner_description: '福岡タワーからの夜景は福岡市内で最も美しい夜景スポットの一つです。特に晴れた夜は、博多湾や福岡市街の輝く灯りを一望できます。カップルにとって特別な思い出になること間違いなしです。'
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

# 糸島のスポットを作成
itoshima_marine = Spot.find_by(spot_name: '糸島マリンアクティビティ') || Spot.find_or_create_by!(
  spot_name: '糸島マリンアクティビティ',
  address: '福岡県糸島市志摩芥屋',
  catchphrase: '美しい海でマリンスポーツを楽しめる',
  district: District.find_by(district_name: '西区'),
  budget_range: 'EXPENSIVE',
  theme: 'アクティブ',
  spot_type: 'ACTIVITY',
  is_rainy_ok: false
)

itoshima_cafe = Spot.find_or_create_by!(
  spot_name: '糸島オーシャンビューカフェ',
  address: '福岡県糸島市志摩桜井',
  catchphrase: '海を眺めながらくつろげるカフェ',
  district: District.find_by(district_name: '西区'),
  budget_range: 'AVERAGE',
  theme: 'グルメ',
  spot_type: 'STORE',
  is_rainy_ok: true
)

itoshima_market = Spot.find_or_create_by!(
  spot_name: '糸島ファーマーズマーケット',
  address: '福岡県糸島市前原',
  catchphrase: '地元の新鮮な農産物や海産物が並ぶマーケット',
  district: District.find_by(district_name: '西区'),
  budget_range: 'AVERAGE',
  theme: 'コスパ',
  spot_type: 'STORE',
  is_rainy_ok: true
)

# プラン3の詳細
if draft_plan.plan_details.empty?
  PlanDetail.create!(
    play_plan: draft_plan,
    step_number: 1,
    step_name: '糸島マリンアクティビティ',
    step_description: '美しい海でSUPやカヤックを楽しむ',
    spot: itoshima_marine,
    comment: '初心者でも楽しめるインストラクター付きのプランがおすすめ',
    start_datetime: Time.now.beginning_of_day + 10.hours,
    end_datetime: Time.now.beginning_of_day + 12.hours,
    budget: 5000,
    planner_title: '糸島の海を満喫',
    planner_description: '糸島の美しい海でマリンアクティビティを楽しみましょう。初心者でも安心して楽しめるインストラクター付きのプランがあります。SUPやカヤックから見る海の景色は格別です。'
  )

  PlanDetail.create!(
    play_plan: draft_plan,
    step_number: 2,
    step_name: '糸島オーシャンビューカフェでランチ',
    step_description: '海を眺めながらゆっくりランチを楽しむ',
    spot: itoshima_cafe,
    comment: '地元の食材を使った料理が絶品。テラス席がおすすめ',
    start_datetime: Time.now.beginning_of_day + 12.hours + 30.minutes,
    end_datetime: Time.now.beginning_of_day + 14.hours,
    budget: 2000,
    planner_title: '絶景カフェでのランチ',
    planner_description: '糸島オーシャンビューカフェは、海を一望できる絶景カフェです。地元の新鮮な食材を使った料理は絶品で、特にシーフード料理がおすすめです。天気の良い日はテラス席で海を眺めながらのランチが最高です。'
  )

  PlanDetail.create!(
    play_plan: draft_plan,
    step_number: 3,
    step_name: '糸島ファーマーズマーケットでお買い物',
    step_description: '地元の新鮮な食材や特産品を購入',
    spot: itoshima_market,
    comment: '糸島野菜や海産物のお土産を購入するのがおすすめ',
    start_datetime: Time.now.beginning_of_day + 14.hours + 30.minutes,
    end_datetime: Time.now.beginning_of_day + 16.hours,
    budget: 3000,
    planner_title: '糸島の味を持ち帰ろう',
    planner_description: '糸島ファーマーズマーケットでは、地元農家や漁師から直接購入できる新鮮な食材が並びます。特に糸島野菜や海産物は鮮度抜群です。お気に入りの食材を見つけて、糸島の味を自宅でも楽しみましょう。'
  )
end

puts "遊びのプランデータの作成が完了しました！"
