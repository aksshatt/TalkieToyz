FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { 'password123' }
    password_confirmation { 'password123' }
    sequence(:name) { |n| "User #{n}" }
    phone { '555-1234' }
    role { :customer }
    bio { 'Test user bio' }
    avatar_url { nil }
    preferences { {} }
    deleted_at { nil }

    trait :admin do
      role { :admin }
    end

    trait :deleted do
      deleted_at { Time.current }
    end
  end
end
