FactoryBot.define do
  factory :consent_agreement do
    association :consent_request
    agreed_at { Time.current }
    agreement_version { 'v1.0' }
    signer_name { 'テスト太郎' }
    signer_instagram { '@test_taro' }
    photographer_name { nil }
    tag_store_requested { false }
    tag_photographer_requested { false }
    tag_accounts_text { nil }
    rights_confirmed { true }
    ip_address { '192.168.1.1' }
    user_agent { 'Mozilla/5.0' }

    agreement_snapshot_json do
      {
        media: ['Webメディア', 'Instagram（あなたのアカウント）'],
        usage_scope: ['投稿', 'ストーリーズ'],
        credits: {
          store_name: true,
          photographer_name: false,
          tag_store: false,
          tag_photographer: false,
          tag_accounts: nil
        },
        modifications_allowed: true,
        modification_note: 'レイアウト都合のトリミングや文字入れを行う場合があります'
      }.to_json
    end

    trait :with_photographer do
      photographer_name { '山田花子' }
      tag_photographer_requested { true }
      tag_accounts_text { '@yamada_hanako' }
    end

    trait :with_store_tag do
      tag_store_requested { true }
      tag_accounts_text { '@store_official' }
    end
  end
end
