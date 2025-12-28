FactoryBot.define do
  factory :order do
    association :user
    coupon { nil }

    sequence(:order_number) { |n| "ORD-#{Time.current.strftime('%Y%m%d')}-#{n.to_s.rjust(8, '0')}" }
    status { :pending }
    payment_method { 'razorpay' }
    payment_status { 'awaiting_payment' }

    subtotal { 100.00 }
    tax { 10.00 }
    shipping_cost { 5.00 }
    discount { 0.00 }
    total { subtotal + tax + shipping_cost - discount }

    shipping_address do
      {
        first_name: 'John',
        last_name: 'Doe',
        address_line1: '123 Main St',
        address_line2: 'Apt 4',
        city: 'Mumbai',
        state: 'Maharashtra',
        postal_code: '400001',
        country: 'India',
        phone: '9876543210'
      }
    end

    billing_address do
      {
        first_name: 'John',
        last_name: 'Doe',
        address_line1: '123 Main St',
        address_line2: 'Apt 4',
        city: 'Mumbai',
        state: 'Maharashtra',
        postal_code: '400001',
        country: 'India',
        phone: '9876543210'
      }
    end

    trait :with_items do
      after(:create) do |order|
        create_list(:order_item, 2, order: order)
      end
    end

    trait :pending do
      status { :pending }
      payment_status { 'awaiting_payment' }
    end

    trait :confirmed do
      status { :confirmed }
      payment_status { 'paid' }
    end

    trait :processing do
      status { :processing }
      payment_status { 'paid' }
    end

    trait :shipped do
      status { :shipped }
      payment_status { 'paid' }
      shipped_at { 2.days.ago }
      tracking_number { "TRACK#{rand(100000..999999)}" }
    end

    trait :delivered do
      status { :delivered }
      payment_status { 'paid' }
      shipped_at { 5.days.ago }
      delivered_at { 1.day.ago }
      tracking_number { "TRACK#{rand(100000..999999)}" }
    end

    trait :cancelled do
      status { :cancelled }
    end

    trait :refunded do
      status { :refunded }
      payment_status { 'refunded' }
    end

    trait :cod do
      payment_method { 'cod' }
      payment_status { 'pending' }
    end

    trait :paid do
      payment_status { 'paid' }
    end

    trait :failed do
      payment_status { 'failed' }
    end

    trait :with_coupon do
      association :coupon
      discount { 10.00 }
    end
  end
end
