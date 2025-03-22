# カテゴリーのシードデータ

puts "カテゴリーデータを更新中..."

# 既存のカテゴリー
existing_categories = ['カフェ', 'レストラン', 'アクティビティ', '観光地', 'ショッピング', 'イベント', 'その他']

# 新しいカテゴリー
new_categories = [
  { id: 'onsen', label: '温泉' },
  { id: 'museum', label: '美術館' },
  { id: 'izakaya', label: '居酒屋' },
  { id: 'roadstation', label: '道の駅' },
  { id: 'experience', label: '体験' },
  { id: 'scenery', label: '絶景' },
  { id: 'cafe', label: 'カフェ' },
  { id: 'shopping', label: 'ショッピング' },
  { id: 'park', label: '公園' },
  { id: 'shrine', label: '神社・寺' }
]

# 既存のカテゴリーを保持しつつ、新しいカテゴリーを追加
existing_categories.each do |category_name|
  Category.find_or_create_by!(name: category_name)
end

new_categories.each do |category|
  # idはシステム内部で使用するため、labelを名前として使用
  Category.find_or_create_by!(name: category[:label])
end

puts "カテゴリーデータの更新が完了しました！"
