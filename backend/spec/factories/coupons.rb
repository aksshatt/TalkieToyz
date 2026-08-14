FactoryBot.define do
  factory :coupon do
    sequence(:code) { |n| "SAVE#{n}" }
    discount_type { 'fixed' }
    discount_value { 10.00 }
    min_order_amount { 0 }
    active { true }
    valid_from { 1.day.ago }
    valid_until { 30.days.from_now }
    usage_limit { 0 }
    usage_count { 0 }

    trait :percentage do
      discount_type { 'percentage' }
      discount_value { 10 }
    end

    trait :expired do
      valid_until { 1.day.ago }
    end
  end
end
