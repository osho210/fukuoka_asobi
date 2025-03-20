FactoryBot.define do
  factory :spot do
    association :district
    sequence(:spot_name) { |n| "テストスポット#{n}" }
    address { "福岡県福岡市中央区天神1-1-1" }
    phone_number { "092-123-4567" }
    website { "https://example.com" }
    catchphrase { "テストキャッチフレーズ" }
    parking_available { true }
    nearest_station { "天神駅" }
    review_rating { 4.5 }
    review_count { 10 }
    instagram_url { "https://instagram.com/test" }
    is_closed { false }
    budget_range { "普通" }
    max_people { 10 }
    min_people { 1 }
    is_rainy_ok { true }
    theme { "グルメ" }
    image_url { "https://example.com/image.jpg" }
    spot_type { "STORE" }
  end
end
