FactoryBot.define do
  factory :play_plan_image_property do
    association :play_plan
    association :attachment, factory: :active_storage_attachment
    is_selected { false }
    position { 1 }
    comment { "Sample comment" }

    trait :selected do
      is_selected { true }
    end

    trait :with_comment do
      comment { "This is a test comment for the image" }
    end

    trait :without_comment do
      comment { nil }
    end
  end
end
