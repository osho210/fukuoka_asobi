FactoryBot.define do
  factory :licensed_asset do
    association :spot
    association :consent_agreement
    asset_type { 'URL' }
    asset_url { 'https://example.com/image.jpg' }
    source_url { 'https://instagram.com/p/test123' }
    caption_note { 'テスト画像' }
    usable { true }

    trait :upload do
      asset_type { 'UPLOAD' }
      asset_url { nil }
    end

    trait :disabled do
      usable { false }
    end

    trait :with_caption do
      caption_note { '店舗の外観写真。晴れた日の午後に撮影。' }
    end
  end
end
