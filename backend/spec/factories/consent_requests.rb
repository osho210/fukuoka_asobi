FactoryBot.define do
  factory :consent_request do
    association :spot
    consenter_type { 'STORE' }
    sequence(:consenter_display_name) { |n| "店長 #{n}" }
    contact_hint { 'Instagram DM' }
    status { 'SENT' }
    token { SecureRandom.urlsafe_base64(32) }
    expires_at { 30.days.from_now }

    trait :draft do
      status { 'DRAFT' }
    end

    trait :approved do
      status { 'APPROVED' }
    end

    trait :rejected do
      status { 'REJECTED' }
    end

    trait :revoked do
      status { 'REVOKED' }
    end

    trait :expired do
      status { 'EXPIRED' }
      expires_at { 1.day.ago }
    end

    trait :instagram_user do
      consenter_type { 'INSTAGRAM_USER' }
      consenter_display_name { '@test_user' }
    end
  end
end
