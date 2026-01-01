FactoryBot.define do
  factory :experience_card do
    sequence(:title) { |n| "体験カードタイトル#{n}" }
    body { "これは体験カードの本文です。福岡での素敵な体験を紹介します。" }
    tags { "静か,会話,カフェ" }
    area { "中央区" }
    duration { 90 }
    time_slot { "昼" }
    active { true }
  end
end
