FactoryBot.define do
  factory :admin_activity_log do
    association :user
    action { AdminActivityLog::ACTIONS.sample }
    resource_type { %w[Product Order User].sample }
    resource_id { rand(1..100) }
    details { { notes: 'Test activity', changes: { status: ['pending', 'completed'] } } }
    ip_address { "127.0.0.1" }
    user_agent { "Mozilla/5.0 (Test Browser)" }

    trait :product_create do
      action { 'create' }
      resource_type { 'Product' }
      details { { name: 'Test Product', price: 99.99 } }
    end

    trait :order_update do
      action { 'update_status' }
      resource_type { 'Order' }
      details { { order_number: 'ORD-123', old_status: 'pending', new_status: 'shipped' } }
    end

    trait :bulk_update do
      action { 'bulk_update' }
      resource_type { 'Product' }
      resource_id { nil }
      details { { action: 'activate', count: 5 } }
    end

    trait :export do
      action { 'export' }
      resource_type { 'Order' }
      resource_id { nil }
      details { { format: 'csv', count: 100 } }
    end
  end
end
