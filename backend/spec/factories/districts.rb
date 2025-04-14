# frozen_string_literal: true

FactoryBot.define do
  factory :district do
    sequence(:district_name) { |n| "テスト地区#{n}" }
    sequence(:slug) { |n| "test-district-#{n}" }
  end
end
