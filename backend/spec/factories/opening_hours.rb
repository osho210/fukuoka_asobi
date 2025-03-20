FactoryBot.define do
  factory :opening_hour do
    association :spot
    day_of_week { %w(月 火 水 木 金 土 日).sample }
    open_time { Time.zone.parse('10:00') }
    close_time { Time.zone.parse('18:00') }
  end
end
