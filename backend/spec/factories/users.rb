# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:username) { |n| "テストユーザー#{n}" }
    sequence(:email) { |n| "test-user-#{n}@example.com" }
    password_hash { 'password_hash' }
    profile_image_url { 'https://example.com/profile.jpg' }
    bio { 'テストユーザーのプロフィール' }
    role { 'ユーザー' }
    is_paid_member { false }
  end
end
