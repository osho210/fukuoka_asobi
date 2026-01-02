# frozen_string_literal: true

puts "方向性カードデータを作成中..."

direction_cards_data = [
  {
    text: "今日は「静かめ」な時間がいい",
    tags: "静か,落ち着き,リラックス",
    weight: 1
  },
  {
    text: "手を動かす遊び、あり？",
    tags: "体験,手作り,アクティビティ",
    weight: 1
  },
  {
    text: "観光っぽくない福岡にしたい",
    tags: "ローカル,日常,穴場",
    weight: 2
  },
  {
    text: "にぎやかな場所で盛り上がりたい",
    tags: "にぎやか,活気,盛り上がり",
    weight: 1
  },
  {
    text: "ゆっくり話せる場所がいい",
    tags: "静か,会話,カフェ",
    weight: 2
  },
  {
    text: "福岡らしい食べ物を味わいたい",
    tags: "グルメ,福岡名物,食事",
    weight: 2
  },
  {
    text: "自然や緑を感じたい",
    tags: "自然,公園,緑,屋外",
    weight: 1
  },
  {
    text: "何か新しいことに挑戦したい",
    tags: "体験,新しい,挑戦",
    weight: 1
  },
  {
    text: "のんびり散歩しながら楽しみたい",
    tags: "散歩,のんびり,まち歩き",
    weight: 2
  },
  {
    text: "写真映えする場所に行きたい",
    tags: "写真,インスタ,映える",
    weight: 1
  },
  {
    text: "雨でも楽しめることがいい",
    tags: "屋内,雨天OK,カフェ,体験",
    weight: 1
  },
  {
    text: "夜までゆっくり楽しみたい",
    tags: "夜,ディナー,バー,夜景",
    weight: 1
  }
]

direction_cards_data.each do |card_data|
  DirectionCard.find_or_create_by!(text: card_data[:text]) do |card|
    card.tags = card_data[:tags]
    card.weight = card_data[:weight]
    card.active = true
  end
end

puts "方向性カードデータの作成が完了しました（#{DirectionCard.count}件）"
