FactoryBot.define do
  factory :google_index_status do
    association :indexable, factory: :spot
    inspected_url { "https://fukuoka-asobi.com/spots/1" }
    coverage_state { "Submitted and indexed" }
    crawled_as { "MOBILE" }
    indexing_allowed { true }
    last_crawl_time { 1.day.ago }
    page_fetch_state { "Successful" }
    verdict { "PASS" }
    google_canonical { "https://fukuoka-asobi.com/spots/1" }
    user_canonical { "https://fukuoka-asobi.com/spots/1" }
    mobile_friendly_verdict { "PASS" }

    trait :not_indexed do
      coverage_state { "Discovered - currently not indexed" }
      verdict { "NEUTRAL" }
    end

    trait :noindex_tag do
      coverage_state { "Excluded by 'noindex' tag" }
      indexing_allowed { false }
      verdict { "FAIL" }
    end

    trait :crawled_not_indexed do
      coverage_state { "Crawled - currently not indexed" }
      verdict { "PARTIAL" }
    end

    trait :not_crawled do
      last_crawl_time { nil }
      verdict { "NEUTRAL" }
    end
  end
end
