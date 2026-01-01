FactoryBot.define do
  factory :direction_card do
    sequence(:text) { |n| "方向性カードテキスト#{n}" }
    tags { "静か,落ち着き,リラックス" }
    weight { 1 }
    active { true }
  end
end
