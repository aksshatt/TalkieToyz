FactoryBot.define do
  factory :product_variant do
    association :product
    sequence(:name) { |n| "Variant #{n}" }
    sequence(:sku) { |n| "VAR-#{SecureRandom.alphanumeric(8).upcase}" }
    price { 24.99 }
    stock_quantity { 10 }
    specifications { { size: "Medium", color: "Blue" } }
    active { true }
    deleted_at { nil }

    trait :out_of_stock do
      stock_quantity { 0 }
    end

    trait :inactive do
      active { false }
    end
  end
end
