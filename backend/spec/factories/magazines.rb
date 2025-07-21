FactoryBot.define do
  factory :magazine do
    name { "福岡ウォーカー" }
    release_date { "2025-07-20" }
    sales_info { "好評発売中" }
    sales_url { "https://www.amazon.co.jp/dp/B000000000" }
    publisher { "KADOKAWA" }
    issue_number { "2025年8月号" }
    cover_image_url { "https://example.com/cover.jpg" }
    description { "福岡の最新情報が満載！" }
    status { "published" }
  end
end
