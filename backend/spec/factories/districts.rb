FactoryBot.define do
  factory :district do
    sequence(:district_name) { |n| "テスト地区#{n}" }
  end
end
