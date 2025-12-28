FactoryBot.define do
  factory :review do
    association :user
    association :product
    rating { rand(3..5) }
    sequence(:title) { |n| "Review Title #{n}" }
    comment { "This is a great product!" }
    verified_purchase { true }
    approved { true }
    helpful_count { 0 }
    deleted_at { nil }
  end
end
