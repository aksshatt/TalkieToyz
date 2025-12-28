FactoryBot.define do
  factory :product do
    sequence(:name) { |n| "Product #{n}" }
    description { "Short description for #{name}" }
    long_description { "Long description for #{name}" }
    price { 29.99 }
    compare_at_price { nil }
    stock_quantity { 50 }
    sequence(:sku) { |n| "TOY-#{SecureRandom.alphanumeric(8).upcase}" }
    slug { name.parameterize }
    min_age { 4 }
    max_age { 8 }
    specifications { { material: "Plastic", dimensions: "10x10x5" } }
    images { [] }
    featured { false }
    view_count { 0 }
    active { true }
    deleted_at { nil }
    association :category

    trait :featured do
      featured { true }
    end

    trait :on_sale do
      compare_at_price { 39.99 }
    end

    trait :out_of_stock do
      stock_quantity { 0 }
    end

    trait :with_speech_goals do
      after(:create) do |product|
        create_list(:speech_goal, 2, products: [product])
      end
    end

    trait :with_variants do
      after(:create) do |product|
        create_list(:product_variant, 2, product: product)
      end
    end
  end
end
