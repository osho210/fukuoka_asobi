FactoryBot.define do
  factory :payment_transaction do
    user { nil }
    stripe_payment_intent_id { "MyString" }
    amount { "9.99" }
    currency { "MyString" }
    status { "MyString" }
    paid_at { "2025-11-25 20:16:11" }
    metadata { "MyText" }
  end
end
