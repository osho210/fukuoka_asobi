FactoryBot.define do
  factory :contact do
    email { "test@example.com" }
    subject { "お問い合わせ件名" }
    inquiry_type { "general" }
    message { "お問い合わせ内容のテキストです。" }
    privacy_policy { true }
  end
end
