# イベントカテゴリのシードデータ
event_categories = [
  {
    name: 'フェス・マーケット',
    description: '音楽フェスティバル、マルシェ、フリーマーケットなど'
  },
  {
    name: '展示会・ギャラリー',
    description: 'アート展示会、写真展、ギャラリーイベントなど'
  },
  {
    name: 'ワークショップ',
    description: '各種ワークショップ、体験イベント、ハンドメイド教室など'
  },
  {
    name: 'スポーツ・アウトドア',
    description: 'スポーツイベント、アウトドアアクティビティ、ヨガなど'
  },
  {
    name: 'グルメ・フード',
    description: 'グルメフェス、飲食イベント、料理教室など'
  },
  {
    name: '伝統・文化',
    description: '祭り、伝統行事、文化イベントなど'
  },
  {
    name: 'セミナー・講演会',
    description: '各種セミナー、講演会、勉強会など'
  },
  {
    name: 'その他',
    description: 'その他のイベント'
  }
]

# データ投入
event_categories.each do |category|
  EventCategory.find_or_create_by!(name: category[:name]) do |c|
    c.description = category[:description]
  end
end

puts "イベントカテゴリの登録が完了しました（#{EventCategory.count}件）"
