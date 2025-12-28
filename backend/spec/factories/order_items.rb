FactoryBot.define do
  factory :order_item do
    association :order
    association :product
    association :product_variant, factory: :product_variant, strategy: :null

    quantity { 1 }
    unit_price { 29.99 }
    total_price { unit_price * quantity }

    product_snapshot do
      {
        name: product&.name || 'Test Product',
        description: product&.description || 'Test Description',
        sku: product&.sku || 'TEST-SKU',
        variant: product_variant&.attributes
      }
    end

    trait :with_variant do
      association :product_variant
    end

    trait :multiple_quantity do
      quantity { rand(2..5) }
    end
  end
end
