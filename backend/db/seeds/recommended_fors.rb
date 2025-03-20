# おすすめ対象のシードデータ
puts "おすすめ対象データを作成中..."

# 基本的なおすすめ対象
recommended_for_names = [
  'カップル',
  '友人',
  '家族',
  '一人',
  '女子会',
  '男子会',
  'デート',
  '記念日',
  '誕生日',
  '同僚',
  '初デート',
  '観光客',
  '学生',
  '社会人',
  'ファミリー',
  '子連れ',
  'シニア',
  '外国人',
  'グループ',
  '女性',
  '男性'
]

# おすすめ対象を作成
recommended_fors = recommended_for_names.map do |name|
  RecommendedFor.find_or_create_by!(name: name)
end

# 既存のプランを取得
play_plans = PlayPlan.all

# 各プランに対して、ランダムなおすすめ対象を関連付ける
play_plans.each do |plan|
  # 既存の関連をクリア
  plan.play_plan_recommended_fors.destroy_all

  # ランダムに2〜4個のおすすめ対象を選択
  selected_recommended_fors = recommended_fors.sample(rand(2..4))

  # 関連付け
  selected_recommended_fors.each do |recommended_for|
    PlayPlanRecommendedFor.create!(
      play_plan: plan,
      recommended_for: recommended_for
    )
  end

  puts "プラン「#{plan.plan_name}」に #{selected_recommended_fors.map(&:name).join(', ')} を関連付けました"
end

puts "おすすめ対象データの作成が完了しました！"
