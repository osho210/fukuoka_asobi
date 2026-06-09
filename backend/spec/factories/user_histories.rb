# frozen_string_literal: true

FactoryBot.define do
  factory :user_history do
    association :user
    association :viewable, factory: :news
    viewed_at { Time.current }

    trait :with_magazine do
      association :viewable, factory: :magazine
    end

    trait :with_play_plan do
      association :viewable, factory: :play_plan
    end

    trait :old do
      viewed_at { 30.days.ago }
    end

    trait :recent do
      viewed_at { 1.day.ago }
    end
  end
end
