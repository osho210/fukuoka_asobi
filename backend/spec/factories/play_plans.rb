# frozen_string_literal: true

FactoryBot.define do
  factory :play_plan do
    sequence(:plan_name) { |n| "テストプラン#{n}" }
    description { 'テストプランの説明文です。' }
    image_url { 'https://example.com/plan.jpg' }
    location { '福岡市中央区' }
    trip_type { 'day_trip' }
    total_budget { 5000 }
    rating { 4.5 }
    review_count { 10 }
    favorite_count { 5 }
    status { 'published' }
    is_indexable { true }
    tags { 'カフェ,ランチ,散歩' }
    association :user
  end
end
