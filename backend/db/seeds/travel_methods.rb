# 移動手段のシードデータ

puts "移動手段データを作成中..."

# 移動手段の選択肢
transportation_options = [
  { id: 'walk', label: '徒歩' },
  { id: 'train', label: '電車' },
  { id: 'car', label: '車' },
  { id: 'bicycle', label: '自転車' },
  { id: 'other', label: 'その他' }
]

# 移動手段のサンプルデータを作成
# 注意: 実際のplan_detailが存在する場合のみ作成
if PlanDetail.exists?
  # 最初の5つのplan_detailに対して移動手段を追加
  PlanDetail.limit(5).each_with_index do |plan_detail, index|
    # ランダムな移動手段を選択
    travel_method = transportation_options.sample[:label]

    # 移動時間をランダムに設定（5分〜60分）
    travel_time = rand(5..60)

    # 移動詳細を作成
    TravelDetail.find_or_create_by!(
      plan_detail: plan_detail,
      sequence_number: 1,
      travel_method: travel_method,
      travel_time: travel_time,
      notes: "#{travel_method}で移動（#{travel_time}分）"
    )

    puts "  - PlanDetail ID: #{plan_detail.id}に移動手段「#{travel_method}」を追加しました"
  end
else
  puts "  - PlanDetailが存在しないため、移動手段のサンプルデータは作成しませんでした"
end

puts "移動手段データの作成が完了しました！"
