require 'rails_helper'

RSpec.describe OrderCreationService do
  let(:user)    { create(:user) }
  let(:product) { create(:product, stock_quantity: 10, price: 50.0) }

  let(:shipping_address) do
    {
      'name' => 'Test User', 'phone' => '9876543210',
      'address_line_1' => '123 Main St', 'city' => 'Mumbai',
      'state' => 'Maharashtra', 'postal_code' => '400001', 'country' => 'India'
    }
  end

  let(:base_params) do
    ActionController::Parameters.new(
      payment_method: 'razorpay',
      shipping_address: shipping_address,
      shipping_cost: 0
    )
  end

  def add_to_cart
    user.cart.add_item(product, 2)
  end

  describe '.call' do
    context 'with empty cart' do
      it 'returns failure' do
        result = described_class.call(user: user, params: base_params)
        expect(result).not_to be_success
        expect(result.error).to match(/cart is empty/i)
      end
    end

    context 'with valid cart and params' do
      before { add_to_cart }

      it 'creates an order' do
        result = described_class.call(user: user, params: base_params)
        expect(result).to be_success
        expect(result.order).to be_a(Order)
        expect(result.order.user_id).to eq(user.id)
      end

      it 'sets payment method' do
        result = described_class.call(user: user, params: base_params)
        expect(result.order.payment_method).to eq('razorpay')
      end
    end

    context 'missing required params' do
      before { add_to_cart }

      it 'fails without payment_method' do
        params = ActionController::Parameters.new(shipping_address: shipping_address)
        result = described_class.call(user: user, params: params)
        expect(result).not_to be_success
        expect(result.error).to match(/payment method/i)
      end

      it 'fails without shipping_address' do
        params = ActionController::Parameters.new(payment_method: 'razorpay')
        result = described_class.call(user: user, params: params)
        expect(result).not_to be_success
      end

      it 'fails with negative shipping_cost' do
        params = base_params.merge(shipping_cost: -10)
        result = described_class.call(user: user, params: params)
        expect(result).not_to be_success
      end
    end

    context 'with COD payment' do
      before { add_to_cart }

      let(:cod_params) { base_params.merge(payment_method: 'cod') }

      it 'creates confirmed order' do
        result = described_class.call(user: user, params: cod_params)
        expect(result).to be_success
        expect(result.order.reload.status).to eq('confirmed')
      end

      it 'awards loyalty points' do
        expect {
          described_class.call(user: user, params: cod_params)
        }.to change { LoyaltyPoint.where(user: user).count }.by(1)
      end
    end

    context 'with coupon' do
      before { add_to_cart }

      let(:coupon) { create(:coupon) }

      it 'applies valid coupon' do
        params = base_params.merge(coupon_code: coupon.code)
        result = described_class.call(user: user, params: params)
        expect(result).to be_success
        expect(result.order.coupon_id).to eq(coupon.id)
      end

      it 'rejects invalid coupon code' do
        params = base_params.merge(coupon_code: 'FAKECODE')
        result = described_class.call(user: user, params: params)
        expect(result).not_to be_success
        expect(result.error).to match(/invalid.*coupon/i)
      end

      it 'rejects already-used coupon' do
        create(:order, user: user, coupon: coupon, status: :confirmed)
        params = base_params.merge(coupon_code: coupon.code)
        result = described_class.call(user: user, params: params)
        expect(result).not_to be_success
        expect(result.error).to match(/already used/i)
      end
    end
  end
end
