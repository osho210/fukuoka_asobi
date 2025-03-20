# ニュースのシードデータ

puts "Creating news..."

# カテゴリーの取得
categories = Category.all.to_a
# 著者（管理者と編集部）の取得
authors = User.where(role: [:admin, :editor]).to_a

# ニュースのサンプルデータ
news_data = [
  {
    title: "福岡の新しい観光スポット「福岡タワーパーク」がオープン",
    body: "福岡市中央区に新しい観光スポット「福岡タワーパーク」がオープンしました。広大な敷地内には、遊具やカフェ、イベントスペースなどが設置され、家族連れやカップルに人気のスポットとなっています。\n\n週末にはさまざまなイベントも開催される予定で、地元の方だけでなく観光客にも楽しんでいただける場所となっています。入場料は大人500円、子供300円で、年間パスポートも販売されています。\n\n営業時間は9:00から18:00まで（季節により変動あり）。詳細は公式サイトをご確認ください。",
    published_at: Time.current - 2.days,
    status: :published,
    image_url: "https://example.com/images/fukuoka-tower-park.jpg",
    category: categories.sample,
    author: authors.sample
  },
  {
    title: "福岡グルメフェスティバル2025の開催が決定",
    body: "福岡の食文化を楽しめる「福岡グルメフェスティバル2025」の開催が決定しました。来年5月に福岡市博多区の福岡国際センターで3日間にわたり開催されます。\n\n福岡の名物料理はもちろん、九州各地の美味しいグルメが一堂に会するイベントで、昨年は3日間で約5万人が来場しました。今年はさらに規模を拡大し、海外からの出店も予定されています。\n\n入場料は前売り券800円、当日券1,000円。前売り券は来月から販売開始予定です。詳細は公式サイトで随時更新されます。",
    published_at: Time.current - 5.days,
    status: :published,
    image_url: "https://example.com/images/fukuoka-gourmet-festival.jpg",
    category: categories.sample,
    author: authors.sample
  },
  {
    title: "福岡市内の公園でナイトピクニックイベントを開催",
    body: "福岡市内の主要公園で、夜の公園を楽しむ「ナイトピクニック」イベントが今月末から開催されます。大濠公園、舞鶴公園など市内5カ所の公園で順次開催され、ライトアップされた公園でピクニックを楽しむことができます。\n\n各会場ではフードトラックの出店や、アコースティックライブなども予定されており、新しい公園の楽しみ方を提案しています。参加は無料ですが、一部エリアは事前予約制となっています。\n\n詳細なスケジュールや予約方法は、福岡市公式サイトでご確認ください。",
    published_at: Time.current - 7.days,
    status: :published,
    image_url: "https://example.com/images/night-picnic.jpg",
    category: categories.sample,
    author: authors.sample
  },
  {
    title: "福岡の隠れた名所を巡るバスツアーが人気",
    body: "福岡の観光名所ではなく、地元の人しか知らない隠れた名所を巡るバスツアーが観光客の間で人気を集めています。地元ガイドの案内で、観光ガイドブックには載っていないスポットや、地元の人に愛されている飲食店などを訪れるツアーです。\n\n参加者からは「観光地とは違う福岡の魅力を発見できた」「地元の人との交流が楽しかった」などの声が寄せられています。ツアーは毎週土日に開催され、料金は一人5,000円（昼食代込み）です。\n\n予約はオンラインで受け付けており、外国語対応のツアーも用意されています。",
    published_at: Time.current - 10.days,
    status: :published,
    image_url: "https://example.com/images/hidden-spots-tour.jpg",
    category: categories.sample,
    author: authors.sample
  },
  {
    title: "福岡アジア映画祭2025の出展作品が決定",
    body: "来年開催される「福岡アジア映画祭2025」の出展作品が決定しました。アジア15カ国から50作品が選出され、福岡市内の映画館で上映されます。\n\n今回は特に若手監督の作品に焦点を当て、新しいアジア映画の潮流を紹介します。また、監督や俳優を招いたトークイベントやワークショップなども開催予定です。\n\nチケットは来年2月から販売開始予定で、全作品鑑賞パスポートや1日パスなどが用意されています。詳細は映画祭公式サイトで確認できます。",
    published_at: Time.current - 15.days,
    status: :published,
    image_url: "https://example.com/images/asia-film-festival.jpg",
    category: categories.sample,
    author: authors.sample
  },
  {
    title: "福岡市内の古民家カフェが観光客に人気",
    body: "福岡市内にある古民家を改装したカフェが、観光客の間で人気を集めています。伝統的な日本家屋の雰囲気を残しながらも、モダンなインテリアを取り入れたこれらのカフェは、SNSでも話題となっています。\n\n特に人気なのは、博多区にある「古民家茶寮」と早良区の「和カフェ藍」。どちらも築100年以上の古民家を改装したもので、季節の和スイーツや地元食材を使ったメニューが楽しめます。\n\n観光客だけでなく地元の方にも愛されるスポットとなっており、週末は予約が必要なほどの人気です。",
    published_at: Time.current - 20.days,
    status: :published,
    image_url: "https://example.com/images/kominka-cafe.jpg",
    category: categories.sample,
    author: authors.sample
  },
  {
    title: "福岡の伝統工芸品を体験できるワークショップが拡大",
    body: "福岡の伝統工芸品を実際に作ることができるワークショップが、観光客や若い世代の間で人気を集めています。博多人形や博多織、小石原焼など、福岡を代表する伝統工芸を気軽に体験できるプログラムが各地で開催されています。\n\n特に外国人観光客からの人気が高く、体験を通じて日本の文化に触れることができると好評です。また、最近では若い職人が講師となり、伝統技術を現代風にアレンジした作品を作るワークショップも増えています。\n\n体験料金は工芸品によって異なりますが、2,000円から10,000円程度で、所要時間は1時間から3時間程度です。予約は各工房のウェブサイトから可能です。",
    published_at: Time.current - 25.days,
    status: :published,
    image_url: "https://example.com/images/traditional-crafts.jpg",
    category: categories.sample,
    author: authors.sample
  },
  {
    title: "福岡市動物園でナイトズーイベントを開催",
    body: "福岡市動物園で、夜間に動物園を楽しめる「ナイトズー」イベントが今夏開催されます。通常は見ることができない夜行性動物の活動的な姿や、昼間とは異なる動物たちの行動を観察できる特別なイベントです。\n\n園内はライトアップされ、幻想的な雰囲気の中で動物観察ができます。また、飼育員による特別ガイドツアーや、動物に関するクイズラリーなども開催予定です。\n\n開催期間は7月の毎週土曜日、営業時間は18:00から21:00まで。入園料は大人800円、子供400円です。混雑が予想されるため、事前のオンライン予約がおすすめです。",
    published_at: Time.current - 30.days,
    status: :published,
    image_url: "https://example.com/images/night-zoo.jpg",
    category: categories.sample,
    author: authors.sample
  },
  {
    title: "福岡の新しい観光アプリがリリース",
    body: "福岡の観光情報を網羅した新しいスマートフォンアプリ「FUKUOKA NAVI」がリリースされました。このアプリでは、観光スポットやレストラン、イベント情報などを簡単に検索できるほか、現在地からの経路案内や多言語対応など、観光客に便利な機能が満載です。\n\n特に注目なのは「地元民おすすめコース」機能。福岡在住の方が実際に利用している穴場スポットや、観光ガイドには載っていないローカルな情報を知ることができます。\n\nアプリは無料でダウンロード可能で、iOS版とAndroid版の両方が提供されています。オフライン機能も充実しているため、海外からの観光客も安心して利用できます。",
    published_at: Time.current - 35.days,
    status: :published,
    image_url: "https://example.com/images/tourism-app.jpg",
    category: categories.sample,
    author: authors.sample
  },
  {
    title: "福岡市内でサステナブルな観光の取り組みが拡大",
    body: "福岡市内で環境に配慮した「サステナブルツーリズム」の取り組みが拡大しています。ホテルや飲食店でのプラスチック削減、地産地消の推進、エコツアーの開発など、様々な分野で持続可能な観光を目指す動きが活発化しています。\n\n特に注目されているのは、市内の複数のホテルが共同で始めた「グリーンステイ」プログラム。滞在中のタオル・リネン交換を減らすことでポイントが貯まり、そのポイントを地域の環境保全活動に寄付できる仕組みです。\n\nまた、地元の食材のみを使用したレストランを巡る「ローカルフードツアー」も人気を集めています。これらの取り組みは、環境意識の高い観光客からの支持を得ています。",
    published_at: Time.current - 40.days,
    status: :published,
    image_url: "https://example.com/images/sustainable-tourism.jpg",
    category: categories.sample,
    author: authors.sample
  }
]

# 下書き状態のニュース
draft_news = [
  {
    title: "福岡市内の新しい公共交通機関の計画が発表",
    body: "福岡市は、市内の交通渋滞緩和と環境負荷軽減を目的とした新しい公共交通機関の計画を発表しました。この計画では、既存の地下鉄網を拡張するとともに、新たに路面電車（LRT）を導入することが検討されています。\n\n路面電車は、天神から博多、さらに福岡タワー方面へと延びる路線が計画されており、観光客の移動手段としても期待されています。また、バス路線の再編も同時に行われ、より効率的な公共交通ネットワークの構築を目指しています。\n\n計画の詳細は今後の市議会で審議される予定で、実現すれば10年以内の完成を目指すとしています。",
    published_at: nil,
    status: :draft,
    image_url: "https://example.com/images/public-transport.jpg",
    category: categories.sample,
    author: authors.sample
  },
  {
    title: "福岡の伝統的な祭りがユネスコ無形文化遺産に申請へ",
    body: "福岡県内の複数の伝統的な祭りが、ユネスコ無形文化遺産への登録申請を行うことが決定しました。博多祇園山笠や戸畑祇園大山笠行事など、長い歴史と独自の文化的価値を持つ祭りが対象となっています。\n\n申請は来年行われる予定で、登録されれば福岡の文化的価値の国際的な認知度が高まるとともに、観光資源としての価値も向上すると期待されています。\n\n県と市は共同で申請準備委員会を設立し、各祭りの歴史的背景や文化的意義を詳細に調査・記録する作業を進めています。登録の可否は申請から約1年半後に決定される見込みです。",
    published_at: nil,
    status: :draft,
    image_url: "https://example.com/images/traditional-festival.jpg",
    category: categories.sample,
    author: authors.sample
  }
]

# アーカイブ状態のニュース
archived_news = [
  {
    title: "福岡市内の観光案内所がリニューアルオープン",
    body: "福岡市内の主要観光案内所がリニューアルオープンしました。天神と博多駅の案内所は、デジタルサイネージを導入し、多言語対応の観光情報を提供しています。また、VR技術を活用した観光スポット体験コーナーも新設されました。\n\n案内スタッフも増員され、英語、中国語、韓国語に対応できるスタッフが常駐しています。観光パンフレットも刷新され、より分かりやすいデザインになりました。\n\n観光案内所の営業時間は9:00から19:00まで（年中無休）。無料Wi-Fiや携帯電話の充電サービスも提供しています。",
    published_at: Time.current - 1.year,
    status: :archived,
    image_url: "https://example.com/images/tourist-information.jpg",
    category: categories.sample,
    author: authors.sample
  },
  {
    title: "福岡市動物園で赤ちゃんパンダが誕生",
    body: "福岡市動物園でジャイアントパンダの赤ちゃんが誕生しました。メスのパンダ「ハナ」（8歳）が昨日未明に出産し、現在は母子ともに健康状態は良好とのことです。\n\n赤ちゃんパンダは体長約15cm、体重約150gで、性別はまだ確認されていません。一般公開は3ヶ月後を予定しており、それまでは特別な保護下で育てられます。\n\n福岡市動物園でのパンダの赤ちゃん誕生は今回が初めてで、園内では祝賀ムードに包まれています。名前は一般公募で決定される予定です。",
    published_at: Time.current - 2.years,
    status: :archived,
    image_url: "https://example.com/images/baby-panda.jpg",
    category: categories.sample,
    author: authors.sample
  }
]

# データベースに保存
news_data.each do |data|
  News.create!(data)
end

draft_news.each do |data|
  News.create!(data)
end

archived_news.each do |data|
  News.create!(data)
end

puts "Created #{News.count} news articles"
