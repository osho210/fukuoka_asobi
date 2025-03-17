# イベントのシードデータ
require_relative 'event_categories'

# カテゴリの取得
fes_market = EventCategory.find_by(name: 'フェス・マーケット')
exhibition = EventCategory.find_by(name: '展示会・ギャラリー')
workshop = EventCategory.find_by(name: 'ワークショップ')
sports = EventCategory.find_by(name: 'スポーツ・アウトドア')
food = EventCategory.find_by(name: 'グルメ・フード')
traditional = EventCategory.find_by(name: '伝統・文化')
seminar = EventCategory.find_by(name: 'セミナー・講演会')
other = EventCategory.find_by(name: 'その他')

# イベントデータ
events = [
  {
    title: '福岡クラフトビアフェスティバル',
    description: '福岡市内外のクラフトビールブルワリーが集結する九州最大級のビールイベント。様々な種類のクラフトビールを楽しめるほか、フードブースも充実。',
    location: '福岡市中央区天神 天神中央公園',
    latitude: 33.5917,
    longitude: 130.3971,
    start_datetime: Time.current + 2.weeks,
    end_datetime: Time.current + 2.weeks + 2.days,
    recurring_rule: nil,
    event_category: fes_market,
    price: '入場無料（飲食は有料）',
    organizer: '福岡クラフトビール協会',
    contact_email: 'info@fukuoka-beer.jp',
    contact_phone: '092-123-4567',
    capacity: 5000,
    status: :published,
    is_online: false,
    source_url: 'itoshima.png',
    banner_image: 'https://example.com/images/beer-festival.jpg'
  },
  {
    title: '糸島ファーマーズマーケット',
    description: '糸島の新鮮な農産物や海産物、加工品などを販売する定期市。地元生産者との交流も楽しめる。',
    location: '糸島市二丈福井 ファームパーク伊都国',
    latitude: 33.5563,
    longitude: 130.1873,
    start_datetime: Time.current + 1.week,
    end_datetime: Time.current + 1.week + 8.hours,
    recurring_rule: 'monthly',
    event_category: fes_market,
    price: '入場無料',
    organizer: '糸島市農業協同組合',
    contact_email: 'info@itoshima-farmers.jp',
    contact_phone: '092-323-1234',
    capacity: 1000,
    status: :published,
    is_online: false,
    source_url: 'https://itoshima-farmers.jp',
    banner_image: 'itoshima.png'
  },
  {
    title: '福岡アートウィーク',
    description: '福岡市内の美術館やギャラリーが連携して開催する芸術週間。様々な展示やワークショップが楽しめる。',
    location: '福岡市内各所',
    latitude: 33.5902,
    longitude: 130.4017,
    start_datetime: Time.current + 1.month,
    end_datetime: Time.current + 1.month + 1.week,
    recurring_rule: 'yearly',
    event_category: exhibition,
    price: '会場により異なる',
    organizer: '福岡アート実行委員会',
    contact_email: 'info@fukuoka-art.jp',
    contact_phone: '092-456-7890',
    capacity: nil,
    status: :published,
    is_online: false,
    source_url: 'https://fukuoka-art-week.jp',
    banner_image: 'itoshima.png'
  },
  {
    title: '博多人形絵付け体験',
    description: '伝統工芸品である博多人形の絵付け体験ができるワークショップ。初心者でも気軽に参加できる。',
    location: '福岡市博多区冷泉町 博多伝統工芸館',
    latitude: 33.5912,
    longitude: 130.4136,
    start_datetime: Time.current + 3.days,
    end_datetime: Time.current + 3.days + 3.hours,
    recurring_rule: 'weekly',
    event_category: workshop,
    price: '3,000円（材料費込み）',
    organizer: '博多人形師会',
    contact_email: 'workshop@hakata-dolls.jp',
    contact_phone: '092-409-5678',
    capacity: 15,
    status: :published,
    is_online: false,
    source_url: 'https://hakata-dolls.jp/workshop',
    banner_image: 'itoshima.png'
  },
  {
    title: '福岡マラソン2025',
    description: '福岡市と糸島市を結ぶ公認マラソン大会。美しい海岸線や市街地を走るコースが魅力。',
    location: '福岡市博多区東平尾公園 博多の森陸上競技場',
    latitude: 33.5954,
    longitude: 130.4615,
    start_datetime: Time.current + 6.months,
    end_datetime: Time.current + 6.months + 8.hours,
    recurring_rule: 'yearly',
    event_category: sports,
    price: '一般参加：10,000円',
    organizer: '福岡マラソン実行委員会',
    contact_email: 'entry@fukuoka-marathon.jp',
    contact_phone: '092-555-1234',
    capacity: 10000,
    status: :published,
    is_online: false,
    source_url: 'https://fukuoka-marathon.jp',
    banner_image: 'itoshima.png'
  },
  {
    title: '福岡ラーメンショー2025',
    description: '全国各地の有名ラーメン店が集結する日本最大級のラーメンイベント。限定メニューや人気店の味を楽しめる。',
    location: '福岡市中央区地行浜 マリンメッセ福岡',
    latitude: 33.5953,
    longitude: 130.4023,
    start_datetime: Time.current + 3.months,
    end_datetime: Time.current + 3.months + 10.days,
    recurring_rule: 'yearly',
    event_category: food,
    price: '入場無料（飲食は有料）',
    organizer: '福岡ラーメン協会',
    contact_email: 'info@fukuoka-ramen.jp',
    contact_phone: '092-777-8888',
    capacity: 50000,
    status: :published,
    is_online: false,
    source_url: 'https://fukuoka-ramen-show.jp',
    banner_image: 'itoshima.png'
  },
  {
    title: '博多祇園山笠',
    description: '770年以上の歴史を持つ博多の伝統祭り。勇壮な「追い山」は必見。',
    location: '福岡市博多区 櫛田神社周辺',
    latitude: 33.5917,
    longitude: 130.4106,
    start_datetime: Time.current + 4.months,
    end_datetime: Time.current + 4.months + 1.week,
    recurring_rule: 'yearly',
    event_category: traditional,
    price: '観覧無料',
    organizer: '博多祇園山笠振興会',
    contact_email: 'info@hakata-gion.jp',
    contact_phone: '092-291-2951',
    capacity: nil,
    status: :published,
    is_online: false,
    source_url: 'https://www.hakatayamakasa.com',
    banner_image: 'itoshima.png'
  },
  {
    title: 'スタートアップカンファレンス福岡',
    description: '九州のスタートアップ企業や投資家が集まるビジネスカンファレンス。講演やピッチイベントを開催。',
    location: '福岡市中央区天神 福岡市スタートアップカフェ',
    latitude: 33.5889,
    longitude: 130.3962,
    start_datetime: Time.current + 2.months,
    end_datetime: Time.current + 2.months + 2.days,
    recurring_rule: 'yearly',
    event_category: seminar,
    price: '一般：5,000円、学生：2,000円',
    organizer: '福岡市経済観光文化局創業・立地推進部',
    contact_email: 'startup@city.fukuoka.jp',
    contact_phone: '092-711-4455',
    capacity: 300,
    status: :published,
    is_online: true,
    source_url: 'https://startup.fukuoka.jp',
    banner_image: 'itoshima.png'
  },
  {
    title: '福岡城さくらまつり',
    description: '福岡城跡で開催される桜の名所イベント。ライトアップやフードブースも充実。',
    location: '福岡市中央区城内 舞鶴公園',
    latitude: 33.5833,
    longitude: 130.3833,
    start_datetime: Time.current + 11.months,
    end_datetime: Time.current + 11.months + 2.weeks,
    recurring_rule: 'yearly',
    event_category: other,
    price: '入場無料',
    organizer: '福岡城さくらまつり実行委員会',
    contact_email: 'info@fukuoka-castle.jp',
    contact_phone: '092-781-2153',
    capacity: nil,
    status: :draft,
    is_online: false,
    source_url: 'https://fukuoka-castle.jp/sakura',
    banner_image: 'itoshima.png'
  }
]

# データ投入
events.each do |event_data|
  Event.find_or_create_by!(title: event_data[:title], start_datetime: event_data[:start_datetime]) do |event|
    event.attributes = event_data
  end
end

puts "イベントの登録が完了しました（#{Event.count}件）"
