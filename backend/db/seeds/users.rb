# ユーザーのシードデータ
puts "ユーザーデータを作成中..."

# 管理者ユーザー
admin_user = User.find_or_create_by!(email: 'admin@example.com') do |user|
  user.username = '管理者'
  user.profile_image_url = 'itoshima.png'
  user.bio = '福岡あそびの管理者です。'
  user.role = :admin
  user.password_hash = 'dummy_hash' # 実際の実装では適切なハッシュ化が必要
  user.instagram_url = 'dummy_hash'
  user.is_paid_member = true
  user.paid_start_date = Date.today - 1.year
  user.paid_end_date = Date.today + 1.year
end

# 編集部ユーザー
editor_user = User.find_or_create_by!(email: 'editor@example.com') do |user|
  user.username = '編集部スタッフ'
  user.profile_image_url = 'itoshima.png'
  user.bio = '福岡の隠れた名所を探すのが趣味です。'
  user.role = :editor
  user.password_hash = 'dummy_hash'
  user.instagram_url = 'https://www.instagram.com/fukuoka_asobi_editor/'
  user.is_paid_member = true
  user.paid_start_date = Date.today - 6.months
  user.paid_end_date = Date.today + 6.months
end

# 一般ユーザー1
user1 = User.find_or_create_by!(email: 'user1@example.com') do |user|
  user.username = 'ふくおか太郎'
  user.profile_image_url = 'itoshima.png'
  user.bio = '福岡在住5年目。カフェ巡りが趣味です。'
  user.role = :user
  user.password_hash = 'dummy_hash'
  user.instagram_url = 'https://www.instagram.com/fukuoka_taro/'
  user.is_paid_member = false
end

# 一般ユーザー2
user2 = User.find_or_create_by!(email: 'user2@example.com') do |user|
  user.username = 'あそび花子'
  user.profile_image_url = 'itoshima.png'
  user.bio = '週末は必ず福岡のどこかに出かけています。おすすめスポット教えます！'
  user.role = :user
  user.password_hash = 'dummy_hash'
  user.instagram_url = 'https://www.instagram.com/asobi_hanako/'
  user.is_paid_member = true
  user.paid_start_date = Date.today - 1.month
  user.paid_end_date = Date.today + 11.months
end

puts "ユーザーデータの作成が完了しました！"
